import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { LeagueForms } from "@/components/LeagueForms";

export default async function LeaguesPage() {
  const user = await requireUser();

  const memberships = await prisma.leagueMember.findMany({
    where: { userId: user.id },
    include: { league: { include: { _count: { select: { members: true } } } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1 text-2xl font-bold">Ligas privadas</h1>
        <p className="text-sm text-muted">
          Compite solo con tus amigos. Crea una liga y comparte el código, o únete a una existente.
        </p>
      </div>

      <LeagueForms />

      <div>
        <h2 className="mb-2 font-semibold">Mis ligas</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {memberships.map((m) => (
            <Link
              key={m.leagueId}
              href={`/leagues/${m.leagueId}`}
              className="rounded-xl border border-border bg-surface p-4 hover:border-primary-light"
            >
              <p className="font-bold">{m.league.name}</p>
              <p className="mt-1 text-xs text-muted">
                Código: <span className="font-mono">{m.league.code}</span> ·{" "}
                {m.league._count.members} miembros
              </p>
            </Link>
          ))}
          {memberships.length === 0 && (
            <p className="text-sm text-muted">Todavía no perteneces a ninguna liga.</p>
          )}
        </div>
      </div>
    </div>
  );
}
