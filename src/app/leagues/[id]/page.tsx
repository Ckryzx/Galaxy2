import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export default async function LeagueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const league = await prisma.league.findUnique({
    where: { id },
    include: {
      members: {
        include: { fantasyTeam: { include: { user: true, scores: true } } },
      },
    },
  });

  if (!league) notFound();

  const isMember = league.members.some((m) => m.userId === user.id);
  if (!isMember) notFound();

  const ranked = league.members
    .map((m) => ({
      id: m.fantasyTeamId,
      name: m.fantasyTeam.name,
      ownerName: m.fantasyTeam.user.name,
      total: m.fantasyTeam.scores.reduce((sum, s) => sum + s.points, 0),
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{league.name}</h1>
        <p className="text-sm text-muted">
          Código de invitación: <span className="font-mono">{league.code}</span>
        </p>
      </div>

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
          </tbody>
        </table>
      </div>
    </div>
  );
}
