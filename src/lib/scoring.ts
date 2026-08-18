import { prisma } from "@/lib/prisma";

/**
 * Recomputes and stores the points every fantasy team earned in a gameweek,
 * based on that team's *current* starting XI/captain and the manual ratings
 * streamers entered for that gameweek. Meant to be run by a streamer/admin
 * once ratings for a gameweek are finalized.
 */
export async function recomputeGameweekScores(gameweekId: string) {
  const [teams, ratings] = await Promise.all([
    prisma.fantasyTeam.findMany({
      include: { players: { where: { isStarting: true } } },
    }),
    prisma.playerRating.findMany({ where: { gameweekId } }),
  ]);

  const ratingByPlayer = new Map(ratings.map((r) => [r.playerId, r.rating]));

  const results: { fantasyTeamId: string; points: number }[] = [];

  for (const team of teams) {
    let points = 0;
    let captainRating: number | null = null;
    let viceCaptainRating: number | null = null;

    for (const slot of team.players) {
      const rating = ratingByPlayer.get(slot.playerId) ?? 0;
      points += rating;
      if (slot.isCaptain) captainRating = rating;
      if (slot.isViceCaptain) viceCaptainRating = rating;
    }

    if (captainRating !== null && captainRating > 0) {
      points += captainRating;
    } else if (viceCaptainRating !== null && viceCaptainRating > 0) {
      points += viceCaptainRating;
    }

    points = Math.round(points * 10) / 10;
    results.push({ fantasyTeamId: team.id, points });
  }

  await prisma.$transaction(
    results.map((result) =>
      prisma.teamGameweekScore.upsert({
        where: {
          fantasyTeamId_gameweekId: {
            fantasyTeamId: result.fantasyTeamId,
            gameweekId,
          },
        },
        create: { fantasyTeamId: result.fantasyTeamId, gameweekId, points: result.points },
        update: { points: result.points },
      }),
    ),
  );

  return results.length;
}
