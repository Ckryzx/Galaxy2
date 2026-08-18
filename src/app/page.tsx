import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          El Fantasy del fútbol chileno,{" "}
          <span className="text-primary-light">con notas de tus streamers</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Arma tu plantilla de 15 jugadores de la Liga de Primera, elige tu once
          titular, tu capitán, y suma puntos con las notas que le ponen a mano
          nuestros streamers después de cada fecha. Nada de estadísticas
          automáticas: acá deciden personas.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/register"
            className="rounded-md bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-light"
          >
            Crear mi equipo
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-border px-5 py-3 font-semibold hover:bg-surface-alt"
          >
            Iniciar sesión
          </Link>
        </div>

        <div className="mt-16 grid gap-4 text-left sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-2 text-2xl">🧑‍💼</div>
            <h3 className="font-semibold">Arma tu plantilla</h3>
            <p className="mt-1 text-sm text-muted">
              100 millones de presupuesto, máximo 3 jugadores por club, igual
              que en el Fantasy que conoces.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-2 text-2xl">🎙️</div>
            <h3 className="font-semibold">Notas manuales</h3>
            <p className="mt-1 text-sm text-muted">
              Streamers de confianza califican a cada jugador después de cada
              fecha, sin depender de estadísticas automáticas.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-2 text-2xl">🏆</div>
            <h3 className="font-semibold">Ligas privadas</h3>
            <p className="mt-1 text-sm text-muted">
              Compite con tus amigos en ligas privadas y en el ranking global.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const [fantasyTeam, currentGameweek, activeGameweeksCount] = await Promise.all([
    prisma.fantasyTeam.findUnique({
      where: { userId: session.user.id },
      include: {
        players: true,
        scores: { orderBy: { gameweek: { number: "desc" } }, take: 1, include: { gameweek: true } },
      },
    }),
    prisma.gameweek.findFirst({ orderBy: { number: "asc" }, where: { status: { in: ["UPCOMING", "IN_PROGRESS"] } } }),
    prisma.gameweek.count(),
  ]);

  const totalPoints = fantasyTeam
    ? (
        await prisma.teamGameweekScore.aggregate({
          where: { fantasyTeamId: fantasyTeam.id },
          _sum: { points: true },
        })
      )._sum.points ?? 0
    : 0;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-6">
        <h1 className="text-2xl font-bold">Hola, {session.user.name} 👋</h1>
        <p className="mt-1 text-muted">
          {fantasyTeam
            ? `Tu equipo "${fantasyTeam.name}" tiene ${fantasyTeam.players.length}/15 jugadores.`
            : "Todavía no tienes un equipo, ¡vamos a armarlo!"}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/team"
            className="rounded-md bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-light"
          >
            {fantasyTeam && fantasyTeam.players.length >= 15 ? "Editar mi equipo" : "Armar mi equipo"}
          </Link>
          <Link
            href="/points"
            className="rounded-md border border-border px-4 py-2 font-semibold hover:bg-surface-alt"
          >
            Ver puntajes
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-muted">Puntos totales</p>
          <p className="mt-1 text-3xl font-bold text-accent">{totalPoints}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-muted">Próxima jornada</p>
          <p className="mt-1 text-3xl font-bold">
            {currentGameweek ? `Fecha ${currentGameweek.number}` : "Temporada finalizada"}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-muted">Jornadas de la temporada</p>
          <p className="mt-1 text-3xl font-bold">{activeGameweeksCount}</p>
        </div>
      </div>
    </div>
  );
}
