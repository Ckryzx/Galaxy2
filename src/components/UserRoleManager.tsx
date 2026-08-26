"use client";

import { useState } from "react";
import type { Role } from "@prisma/client";
import { updateUserRole } from "@/app/admin/users/actions";

type UserVM = { id: string; name: string; email: string; role: Role };

const ROLE_LABEL: Record<Role, string> = {
  USER: "Usuario",
  STREAMER: "Streamer",
  ADMIN: "Admin",
};

export function UserRoleManager({
  users,
  currentUserId,
}: {
  users: UserVM[];
  currentUserId: string;
}) {
  const [rows, setRows] = useState(users);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  async function handleChange(userId: string, role: Role) {
    setSavingId(userId);
    setFeedback(null);
    const result = await updateUserRole(userId, role);
    setSavingId(null);

    if (result.ok) {
      setRows((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
      setFeedback({ type: "ok", text: "Rol actualizado." });
    } else {
      setFeedback({ type: "error", text: result.error });
    }
  }

  return (
    <div className="space-y-3">
      {feedback && (
        <div
          className={`rounded-md border px-4 py-2 text-sm ${
            feedback.type === "ok"
              ? "border-accent-dark bg-accent/10 text-accent"
              : "border-danger bg-danger/10 text-danger"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-alt text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Correo</th>
              <th className="px-3 py-2">Rol</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-t border-border/60">
                <td className="px-3 py-2 font-medium">
                  {u.name} {u.id === currentUserId && <span className="text-xs text-muted">(tú)</span>}
                </td>
                <td className="px-3 py-2 text-muted">{u.email}</td>
                <td className="px-3 py-2">
                  <select
                    value={u.role}
                    disabled={savingId === u.id}
                    onChange={(e) => handleChange(u.id, e.target.value as Role)}
                    className="rounded-md border border-border bg-surface-alt px-2 py-1.5 text-sm disabled:opacity-50"
                  >
                    {(Object.keys(ROLE_LABEL) as Role[]).map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABEL[role]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
