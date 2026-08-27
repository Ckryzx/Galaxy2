import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { TeamBuilder } from "@/components/TeamBuilder";
import { createFantasyTeamWithDefaultSquad } from "@/lib/defaultSquad";

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await requireUser();
  const { tab } = await searchParams;
  const initialTab = tab === "market" ? "plantilla" : "alineacion";

  let team = await prisma.fantasyTeam.findUnique({
    where: { userId: user.id },
    include: { players: true },
  });

  if (!team) {
    await createFantasyTeamWithDefaultSquad(prisma, user.id, `Equipo de ${user.name}`);
    team = await prisma.fantasyTeam.findUnique({
      where: { userId: user.id },
      include: { players: true },
    });
  }

  if (!team) {
    throw new Error("No se pudo crear el equipo");
  }

  const squadPlayerIds = team.players.map((s) => s.playerId);

  const [players, clubs, ratings] = await Promise.all([
    prisma.player.findMany({
      include: { club: true },
      orderBy: [{ position: "asc" }, { price: "desc" }],
    }),
    prisma.club.findMany({ orderBy: { name: "asc" } }),
    prisma.playerRating.findMany({
      where: { playerId: { in: squadPlayerIds } },
      include: { gameweek: true },
      orderBy: { gameweek: { number: "asc" } },
    }),
  ]);

  const ratingsHistory: Record<string, { gameweekNumber: number; rating: number }[]> = {};
  for (const rating of ratings) {
    if (!ratingsHistory[rating.playerId]) ratingsHistory[rating.playerId] = [];
    ratingsHistory[rating.playerId].push({
      gameweekNumber: rating.gameweek.number,
      rating: rating.rating,
    });
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Mi equipo</h1>
      <TeamBuilder
        key={initialTab}
        players={players.map((p) => ({
          id: p.id,
          name: p.name,
          position: p.position,
          price: p.price,
          clubId: p.clubId,
          clubName: p.club.name,
          clubShort: p.club.shortName,
        }))}
        clubs={clubs.map((c) => ({ id: c.id, name: c.name, shortName: c.shortName }))}
        initialSquad={team.players.map((s) => ({
          playerId: s.playerId,
          isStarting: s.isStarting,
          isCaptain: s.isCaptain,
          isViceCaptain: s.isViceCaptain,
        }))}
        teamName={team.name}
        ratingsHistory={ratingsHistory}
        initialTab={initialTab}
      />
    </div>
  );
}
