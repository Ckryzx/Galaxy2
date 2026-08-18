import Link from "next/link";
import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border border-border bg-surface p-6">
        <h1 className="mb-1 text-2xl font-bold">Crear cuenta</h1>
        <p className="mb-6 text-sm text-muted">
          Arma tu equipo y compite en la Fantasy Liga Chilena.
        </p>
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-muted">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-primary-light hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
