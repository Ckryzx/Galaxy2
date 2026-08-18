import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { TeamBuilder } from "@/components/TeamBuilder";

export default async function TeamPage() {
  const user = await requireUser();

  let team = await prisma.fantasyTeam.findUnique({
    where: { userId: user.id },
    include: { players: true },
  });

  if (!team) {
    team = await prisma.fantasyTeam.create({
      data: { userId: user.id, name: `Equipo de ${user.name}` },
      include: { players: true },
    });
  }

  const [players, clubs] = await Promise.all([
    prisma.player.findMany({
      include: { club: true },
      orderBy: [{ position: "asc" }, { price: "desc" }],
    }),
    prisma.club.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Mi equipo</h1>
      <TeamBuilder
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
      />
    </div>
  );
}
