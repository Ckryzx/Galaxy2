"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-surface-alt hover:text-foreground transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
