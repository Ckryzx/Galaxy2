import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { RatingForm } from "@/components/RatingForm";

export default async function AdminGameweekPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  await requireRole(["STREAMER", "ADMIN"]);
  const { number } = await params;
  const gameweekNumber = Number(number);

  const gameweek = await prisma.gameweek.findUnique({ where: { number: gameweekNumber } });
  if (!gameweek) notFound();

  const [players, clubs, ratings] = await Promise.all([
    prisma.player.findMany({
      include: { club: true },
      orderBy: [{ club: { name: "asc" } }, { position: "asc" }],
    }),
    prisma.club.findMany({ orderBy: { name: "asc" } }),
    prisma.playerRating.findMany({ where: { gameweekId: gameweek.id } }),
  ]);

  const initialRatings = Object.fromEntries(ratings.map((r) => [r.playerId, r.rating]));

  return (
    <RatingForm
      gameweekId={gameweek.id}
      gameweekNumber={gameweek.number}
      gameweekStatus={gameweek.status}
      players={players.map((p) => ({
        id: p.id,
        name: p.name,
        position: p.position,
        clubId: p.clubId,
        clubName: p.club.name,
        clubShort: p.club.shortName,
      }))}
      clubs={clubs.map((c) => ({ id: c.id, name: c.name }))}
      initialRatings={initialRatings}
    />
  );
}
