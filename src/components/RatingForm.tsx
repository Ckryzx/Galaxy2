"use client";

import { useMemo, useState } from "react";
import { saveRatings, finalizeGameweek, setGameweekStatus } from "@/app/admin/actions";
import type { GameweekStatus } from "@prisma/client";

export type RatingPlayerVM = {
  id: string;
  name: string;
  position: string;
  clubId: string;
  clubName: string;
  clubShort: string;
};

export function RatingForm({
  gameweekId,
  gameweekNumber,
  gameweekStatus,
  players,
  clubs,
  initialRatings,
}: {
  gameweekId: string;
  gameweekNumber: number;
  gameweekStatus: GameweekStatus;
  players: RatingPlayerVM[];
  clubs: { id: string; name: string }[];
  initialRatings: Record<string, number>;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const [id, rating] of Object.entries(initialRatings)) {
      init[id] = String(rating);
    }
    return init;
  });
  const [clubFilter, setClubFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const filteredPlayers = useMemo(
    () =>
      players.filter((p) => {
        if (clubFilter !== "ALL" && p.clubId !== clubFilter) return false;
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [players, clubFilter, search],
  );

  const ratedCount = Object.values(values).filter((v) => v.trim() !== "").length;

  async function handleSave() {
    setSaving(true);
    setFeedback(null);
    const ratings = Object.entries(values)
      .filter(([, value]) => value.trim() !== "")
      .map(([playerId, value]) => ({ playerId, rating: Number(value) }));

    const result = await saveRatings(gameweekId, ratings);
    setSaving(false);

    if (result.ok) {
      setFeedback({ type: "ok", text: `Se guardaron ${result.count} notas.` });
    } else {
      setFeedback({ type: "error", text: result.error });
    }
  }

  async function handleFinalize() {
    setFinalizing(true);
    setFeedback(null);
    await handleSave();
    const result = await finalizeGameweek(gameweekId);
    setFinalizing(false);
    setFeedback({
      type: "ok",
      text: `Jornada finalizada. Se recalcularon los puntajes de ${result.teamsUpdated} equipos.`,
    });
  }

  async function handleStatusChange(status: GameweekStatus) {
    await setGameweekStatus(gameweekId, status);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4">
        <div>
          <h1 className="text-xl font-bold">Notas — Fecha {gameweekNumber}</h1>
          <p className="text-sm text-muted">{ratedCount} de {players.length} jugadores con nota</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={gameweekStatus}
            onChange={(e) => handleStatusChange(e.target.value as GameweekStatus)}
            className="rounded-md border border-border bg-surface-alt px-2 py-1.5 text-sm"
          >
            <option value="UPCOMING">Próxima</option>
            <option value="IN_PROGRESS">En curso</option>
            <option value="FINISHED">Finalizada</option>
          </select>
        </div>
      </div>

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

      <div className="flex flex-wrap gap-2">
        <select
          value={clubFilter}
          onChange={(e) => setClubFilter(e.target.value)}
          className="rounded-md border border-border bg-surface-alt px-2 py-1.5 text-sm"
        >
          <option value="ALL">Todos los clubes</option>
          {clubs.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar jugador..."
          className="flex-1 min-w-[160px] rounded-md border border-border bg-surface-alt px-2 py-1.5 text-sm"
        />
      </div>

      <div className="max-h-[560px] overflow-y-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-surface-alt text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-2">Jugador</th>
              <th className="px-3 py-2">Club</th>
              <th className="px-3 py-2">Pos</th>
              <th className="px-3 py-2">Nota (0-10)</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => (
              <tr key={player.id} className="border-t border-border/60 hover:bg-surface-alt/60">
                <td className="px-3 py-2 font-medium">{player.name}</td>
                <td className="px-3 py-2 text-muted">{player.clubShort}</td>
                <td className="px-3 py-2 text-muted">{player.position}</td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.5}
                    value={values[player.id] ?? ""}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [player.id]: e.target.value }))
                    }
                    placeholder="—"
                    className="w-20 rounded-md border border-border bg-surface-alt px-2 py-1 outline-none focus:border-primary-light"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md border border-border px-5 py-2.5 font-semibold hover:bg-surface-alt disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar notas"}
        </button>
        <button
          onClick={handleFinalize}
          disabled={finalizing}
          className="rounded-md bg-accent px-5 py-2.5 font-semibold text-white hover:bg-accent-dark disabled:opacity-50"
        >
          {finalizing ? "Calculando..." : "Finalizar jornada y calcular puntajes"}
        </button>
      </div>
    </div>
  );
}
