import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/SignOutButton";

const baseLinks = [
  { href: "/players", label: "Jugadores" },
  { href: "/points", label: "Puntajes" },
  { href: "/leagues", label: "Ligas" },
  { href: "/ranking", label: "Ranking" },
];

export async function Nav() {
  const session = await auth();
  const role = session?.user?.role;

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
            ⚽
          </span>
          <span>
            Fantasy <span className="text-primary-light">Liga Chilena</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {session?.user && (
            <Link
              href="/team"
              className="rounded-md px-3 py-2 font-medium hover:bg-surface-alt transition-colors"
            >
              Mi Equipo
            </Link>
          )}
          {baseLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 font-medium hover:bg-surface-alt transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {(role === "STREAMER" || role === "ADMIN") && (
            <Link
              href="/admin"
              className="rounded-md px-3 py-2 font-medium text-accent hover:bg-surface-alt transition-colors"
            >
              Panel Streamer
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <span className="hidden sm:inline text-sm text-muted">
                Hola, {session.user.name}
              </span>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-surface-alt transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-light transition-colors"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
      <nav className="md:hidden flex items-center gap-1 overflow-x-auto px-4 pb-2 text-sm">
        {session?.user && (
          <Link href="/team" className="whitespace-nowrap rounded-md px-3 py-1.5 hover:bg-surface-alt">
            Mi Equipo
          </Link>
        )}
        {baseLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-md px-3 py-1.5 hover:bg-surface-alt"
          >
            {link.label}
          </Link>
        ))}
        {(role === "STREAMER" || role === "ADMIN") && (
          <Link href="/admin" className="whitespace-nowrap rounded-md px-3 py-1.5 text-accent hover:bg-surface-alt">
            Panel Streamer
          </Link>
        )}
      </nav>
    </header>
  );
}
