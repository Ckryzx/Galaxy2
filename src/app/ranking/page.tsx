import { prisma } from "@/lib/prisma";

export default async function RankingPage() {
  const teams = await prisma.fantasyTeam.findMany({
    include: { user: true, scores: true },
  });

  const ranked = teams
    .map((team) => ({
      id: team.id,
      name: team.name,
      ownerName: team.user.name,
      total: team.scores.reduce((sum, s) => sum + s.points, 0),
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Ranking global</h1>
      <p className="mb-4 text-sm text-muted">Todos los equipos de Fantasy Liga Chilena.</p>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-alt text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Equipo</th>
              <th className="px-3 py-2">Manager</th>
              <th className="px-3 py-2">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((team, index) => (
              <tr key={team.id} className="border-t border-border/60">
                <td className="px-3 py-2 font-bold">{index + 1}</td>
                <td className="px-3 py-2 font-medium">{team.name}</td>
                <td className="px-3 py-2 text-muted">{team.ownerName}</td>
                <td className="px-3 py-2 font-semibold text-accent">{team.total.toFixed(1)}</td>
              </tr>
            ))}
            {ranked.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-muted">
                  Todavía no hay equipos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
