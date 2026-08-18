import { prisma } from "@/lib/prisma";

export default async function PlayersPage() {
  const players = await prisma.player.findMany({
    include: { club: true },
    orderBy: [{ price: "desc" }],
  });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Jugadores</h1>
      <p className="mb-4 text-sm text-muted">
        Todos los jugadores disponibles de la Liga de Primera para tu plantilla.
      </p>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-alt text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-2">Jugador</th>
              <th className="px-3 py-2">Club</th>
              <th className="px-3 py-2">Posición</th>
              <th className="px-3 py-2">Precio</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id} className="border-t border-border/60 hover:bg-surface-alt/60">
                <td className="px-3 py-2 font-medium">{p.name}</td>
                <td className="px-3 py-2 text-muted">{p.club.name}</td>
                <td className="px-3 py-2 text-muted">{p.position}</td>
                <td className="px-3 py-2">{p.price.toFixed(1)}M</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
