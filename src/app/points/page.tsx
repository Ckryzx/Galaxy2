import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

const STATUS_LABEL: Record<string, string> = {
  UPCOMING: "Próxima",
  IN_PROGRESS: "En curso",
  FINISHED: "Finalizada",
};

export default async function PointsPage() {
  const user = await requireUser();

  const team = await prisma.fantasyTeam.findUnique({
    where: { userId: user.id },
    include: { scores: true },
  });

  const gameweeks = await prisma.gameweek.findMany({ orderBy: { number: "asc" } });
  const scoreByGameweek = new Map(team?.scores.map((s) => [s.gameweekId, s.points]) ?? []);
  const total = team?.scores.reduce((sum, s) => sum + s.points, 0) ?? 0;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mis puntajes</h1>
        <div className="rounded-lg border border-border bg-surface px-4 py-2 text-right">
          <p className="text-xs text-muted">Total temporada</p>
          <p className="text-2xl font-bold text-accent">{total.toFixed(1)}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-alt text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {gameweeks.map((gw) => {
              const points = scoreByGameweek.get(gw.id);
              return (
                <tr key={gw.id} className="border-t border-border/60">
                  <td className="px-3 py-2 font-medium">Fecha {gw.number}</td>
                  <td className="px-3 py-2 text-muted">{STATUS_LABEL[gw.status]}</td>
                  <td className="px-3 py-2">
                    {points !== undefined ? (
                      <span className="font-semibold text-accent">{points.toFixed(1)}</span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
