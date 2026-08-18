"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLeague, joinLeague } from "@/app/leagues/actions";

export function LeagueForms() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);
    const result = await createLeague(name);
    setLoading(false);
    if (result.ok) {
      setName("");
      setFeedback({ type: "ok", text: `Liga creada. Código para invitar: ${result.code}` });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: result.error });
    }
  }

  async function handleJoin(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);
    const result = await joinLeague(code);
    setLoading(false);
    if (result.ok) {
      setCode("");
      setFeedback({ type: "ok", text: "¡Te uniste a la liga!" });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: result.error });
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <form onSubmit={handleCreate} className="rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-2 font-semibold">Crear una liga</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la liga"
          className="w-full rounded-md border border-border bg-surface-alt px-3 py-2 text-sm outline-none focus:border-primary-light"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full rounded-md bg-primary py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
        >
          Crear liga
        </button>
      </form>

      <form onSubmit={handleJoin} className="rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-2 font-semibold">Unirse con un código</h2>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código de invitación"
          className="w-full rounded-md border border-border bg-surface-alt px-3 py-2 text-sm uppercase outline-none focus:border-primary-light"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full rounded-md bg-accent py-2 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-50"
        >
          Unirme
        </button>
      </form>

      {feedback && (
        <div
          className={`sm:col-span-2 rounded-md border px-4 py-2 text-sm ${
            feedback.type === "ok"
              ? "border-accent-dark bg-accent/10 text-accent"
              : "border-danger bg-danger/10 text-danger"
          }`}
        >
          {feedback.text}
        </div>
      )}
    </div>
  );
}
