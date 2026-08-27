import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border border-border bg-surface p-6">
        <h1 className="mb-1 text-2xl font-bold">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-muted">
          Entra a tu cuenta de Fantasy Liga Chilena.
        </p>
        <GoogleSignInButton />
        <div className="my-4 flex items-center gap-3 text-xs text-muted">
          <div className="h-px flex-1 bg-border" />
          o con tu correo
          <div className="h-px flex-1 bg-border" />
        </div>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-muted">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-primary-light hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
