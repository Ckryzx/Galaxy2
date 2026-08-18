import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

const STATUS_LABEL: Record<string, string> = {
  UPCOMING: "Próxima",
  IN_PROGRESS: "En curso",
  FINISHED: "Finalizada",
};

export default async function AdminPage() {
  await requireRole(["STREAMER", "ADMIN"]);

  const gameweeks = await prisma.gameweek.findMany({
    orderBy: { number: "asc" },
    include: { _count: { select: { ratings: true } } },
  });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Panel de streamer</h1>
      <p className="mb-6 text-sm text-muted">
        Elige una jornada para ingresar las notas de cada jugador a mano.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gameweeks.map((gw) => (
          <Link
            key={gw.id}
            href={`/admin/gameweek/${gw.number}`}
            className="rounded-xl border border-border bg-surface p-4 hover:border-primary-light"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">Fecha {gw.number}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  gw.status === "FINISHED"
                    ? "bg-accent/20 text-accent"
                    : gw.status === "IN_PROGRESS"
                      ? "bg-primary/20 text-primary-light"
                      : "bg-surface-alt text-muted"
                }`}
              >
                {STATUS_LABEL[gw.status]}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted">
              {gw._count.ratings} notas ingresadas
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
