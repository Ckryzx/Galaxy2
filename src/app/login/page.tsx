import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border border-border bg-surface p-6">
        <h1 className="mb-1 text-2xl font-bold">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-muted">
          Entra a tu cuenta de Fantasy Liga Chilena.
        </p>
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
