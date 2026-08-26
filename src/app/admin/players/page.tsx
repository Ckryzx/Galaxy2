import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PlayerManager } from "@/components/PlayerManager";

export default async function AdminPlayersPage() {
  await requireRole(["ADMIN"]);

  const [players, clubs] = await Promise.all([
    prisma.player.findMany({
      include: { club: true },
      orderBy: [{ club: { name: "asc" } }, { position: "asc" }, { name: "asc" }],
    }),
    prisma.club.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Jugadores</h1>
      <p className="mb-6 text-sm text-muted">
        Agrega, edita o quita jugadores para mantener los planteles al día
        cuando haya fichajes o cambios de club.
      </p>
      <PlayerManager
        players={players.map((p) => ({
          id: p.id,
          name: p.name,
          position: p.position,
          price: p.price,
          clubId: p.clubId,
        }))}
        clubs={clubs.map((c) => ({ id: c.id, name: c.name, shortName: c.shortName }))}
      />
    </div>
  );
}
