"use client";

import { useMemo, useState } from "react";
import type { Position } from "@prisma/client";
import {
  BUDGET,
  MAX_PER_CLUB,
  SQUAD_COMPOSITION,
  STARTING_LIMITS,
  STARTING_SIZE,
} from "@/lib/squadRules";
import { saveSquad, renameTeam } from "@/app/team/actions";

export type PlayerVM = {
  id: string;
  name: string;
  position: Position;
  price: number;
  clubId: string;
  clubName: string;
  clubShort: string;
};

export type ClubVM = { id: string; name: string; shortName: string };

type SquadState = {
  isStarting: boolean;
  isCaptain: boolean;
  isViceCaptain: boolean;
};

const POSITION_LABEL: Record<Position, string> = {
  GK: "Arquero",
  DEF: "Defensa",
  MID: "Mediocampista",
  FWD: "Delantero",
};

const POSITION_ORDER: Position[] = ["GK", "DEF", "MID", "FWD"];

export function TeamBuilder({
  players,
  clubs,
  initialSquad,
  teamName,
}: {
  players: PlayerVM[];
  clubs: ClubVM[];
  initialSquad: { playerId: string; isStarting: boolean; isCaptain: boolean; isViceCaptain: boolean }[];
  teamName: string;
}) {
  const playerById = useMemo(() => new Map(players.map((p) => [p.id, p])), [players]);

  const [squad, setSquad] = useState<Map<string, SquadState>>(
    () =>
      new Map(
        initialSquad.map((s) => [
          s.playerId,
          { isStarting: s.isStarting, isCaptain: s.isCaptain, isViceCaptain: s.isViceCaptain },
        ]),
      ),
  );
  const [tab, setTab] = useState<"plantilla" | "alineacion">("plantilla");
  const [positionFilter, setPositionFilter] = useState<Position | "ALL">("ALL");
  const [clubFilter, setClubFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [name, setName] = useState(teamName);
  const [savingName, setSavingName] = useState(false);

  const squadPlayers = useMemo(
    () => Array.from(squad.keys()).map((id) => playerById.get(id)).filter((p): p is PlayerVM => !!p),
    [squad, playerById],
  );

  const totalCost = squadPlayers.reduce((sum, p) => sum + p.price, 0);
  const remainingBudget = Math.round((BUDGET - totalCost) * 10) / 10;

  const countByPosition: Record<Position, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  const countByClub = new Map<string, number>();
  for (const p of squadPlayers) {
    countByPosition[p.position] += 1;
    countByClub.set(p.clubId, (countByClub.get(p.clubId) ?? 0) + 1);
  }

  const startingPlayers = squadPlayers.filter((p) => squad.get(p.id)?.isStarting);
  const benchPlayers = squadPlayers.filter((p) => !squad.get(p.id)?.isStarting);
  const startingCountByPosition: Record<Position, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  for (const p of startingPlayers) startingCountByPosition[p.position] += 1;
  const formation = `${startingCountByPosition.DEF}-${startingCountByPosition.MID}-${startingCountByPosition.FWD}`;

  const captainId = squadPlayers.find((p) => squad.get(p.id)?.isCaptain)?.id ?? null;
  const viceCaptainId = squadPlayers.find((p) => squad.get(p.id)?.isViceCaptain)?.id ?? null;

  function canAdd(player: PlayerVM): string | null {
    if (squad.size >= 15) return "Ya tienes 15 jugadores.";
    if (countByPosition[player.position] >= SQUAD_COMPOSITION[player.position]) {
      return `Ya tienes el máximo de ${POSITION_LABEL[player.position].toLowerCase()}s (${SQUAD_COMPOSITION[player.position]}).`;
    }
    if ((countByClub.get(player.clubId) ?? 0) >= MAX_PER_CLUB) {
      return `Ya tienes ${MAX_PER_CLUB} jugadores de ${player.clubName}.`;
    }
    if (player.price > remainingBudget) {
      return "No te alcanza el presupuesto.";
    }
    return null;
  }

  function addPlayer(player: PlayerVM) {
    const blocked = canAdd(player);
    if (blocked) {
      setFeedback({ type: "error", text: blocked });
      return;
    }
    setSquad((prev) => {
      const next = new Map(prev);
      const startersNow = Array.from(prev.entries()).filter(([, s]) => s.isStarting);
      const posCount = startersNow.filter(([id]) => playerById.get(id)?.position === player.position).length;
      const canAutoStart =
        startersNow.length < STARTING_SIZE && posCount < STARTING_LIMITS[player.position].max;
      next.set(player.id, { isStarting: canAutoStart, isCaptain: false, isViceCaptain: false });
      return next;
    });
    setFeedback(null);
  }

  function removePlayer(playerId: string) {
    setSquad((prev) => {
      const next = new Map(prev);
      next.delete(playerId);
      return next;
    });
    setFeedback(null);
  }

  function toggleStarting(player: PlayerVM) {
    setSquad((prev) => {
      const current = prev.get(player.id);
      if (!current) return prev;
      const next = new Map(prev);

      if (current.isStarting) {
        next.set(player.id, { isStarting: false, isCaptain: false, isViceCaptain: false });
        return next;
      }

      const startersNow = Array.from(next.entries()).filter(([, s]) => s.isStarting);
      if (startersNow.length >= STARTING_SIZE) {
        setFeedback({ type: "error", text: `Ya tienes ${STARTING_SIZE} titulares. Saca a alguien primero.` });
        return prev;
      }
      const posCount = startersNow.filter(([id]) => playerById.get(id)?.position === player.position).length;
      if (posCount >= STARTING_LIMITS[player.position].max) {
        setFeedback({
          type: "error",
          text: `No puedes tener más de ${STARTING_LIMITS[player.position].max} ${POSITION_LABEL[player.position].toLowerCase()}s titulares.`,
        });
        return prev;
      }
      next.set(player.id, { ...current, isStarting: true });
      return next;
    });
  }

  function setCaptain(playerId: string) {
    setSquad((prev) => {
      const next = new Map(prev);
      for (const [id, s] of next) {
        next.set(id, { ...s, isCaptain: id === playerId ? true : false });
      }
      return next;
    });
  }

  function setViceCaptain(playerId: string) {
    setSquad((prev) => {
      const next = new Map(prev);
      for (const [id, s] of next) {
        next.set(id, { ...s, isViceCaptain: id === playerId ? true : false });
      }
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setFeedback(null);
    const result = await saveSquad({
      playerIds: squadPlayers.map((p) => p.id),
      startingIds: startingPlayers.map((p) => p.id),
      captainId,
      viceCaptainId,
    });
    setSaving(false);
    if (result.ok) {
      setFeedback({ type: "ok", text: "¡Equipo guardado con éxito!" });
    } else {
      setFeedback({ type: "error", text: result.errors.join(" ") });
    }
  }

  async function handleRename() {
    setSavingName(true);
    const result = await renameTeam(name);
    setSavingName(false);
    if (!result.ok) {
      setFeedback({ type: "error", text: result.errors.join(" ") });
    }
  }

  const filteredPlayers = players.filter((p) => {
    if (positionFilter !== "ALL" && p.position !== positionFilter) return false;
    if (clubFilter !== "ALL" && p.clubId !== clubFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md border border-border bg-surface-alt px-2 py-1 text-lg font-bold outline-none focus:border-primary-light"
            />
            <button
              onClick={handleRename}
              disabled={savingName || name.trim() === teamName}
              className="rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-surface-alt disabled:opacity-40"
            >
              {savingName ? "Guardando..." : "Renombrar"}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span>
              Presupuesto: <strong className={remainingBudget < 0 ? "text-danger" : "text-accent"}>
                {remainingBudget.toFixed(1)}M
              </strong>{" "}
              <span className="text-muted">restante de {BUDGET}M</span>
            </span>
            <span>
              Jugadores: <strong>{squad.size}</strong> / 15
            </span>
            <span>
              Formación: <strong>{formation}</strong> ({startingPlayers.length}/{STARTING_SIZE})
            </span>
          </div>
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

      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setTab("plantilla")}
          className={`px-4 py-2 text-sm font-semibold ${
            tab === "plantilla" ? "border-b-2 border-primary-light text-primary-light" : "text-muted"
          }`}
        >
          1. Elegir plantilla (15)
        </button>
        <button
          onClick={() => setTab("alineacion")}
          className={`px-4 py-2 text-sm font-semibold ${
            tab === "alineacion" ? "border-b-2 border-primary-light text-primary-light" : "text-muted"
          }`}
        >
          2. Alineación y capitán
        </button>
      </div>

      {tab === "plantilla" ? (
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value as Position | "ALL")}
                className="rounded-md border border-border bg-surface-alt px-2 py-1.5 text-sm"
              >
                <option value="ALL">Todas las posiciones</option>
                {POSITION_ORDER.map((pos) => (
                  <option key={pos} value={pos}>
                    {POSITION_LABEL[pos]}
                  </option>
                ))}
              </select>
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
                    <th className="px-3 py-2">Precio</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player) => {
                    const inSquad = squad.has(player.id);
                    const blocked = !inSquad ? canAdd(player) : null;
                    return (
                      <tr key={player.id} className="border-t border-border/60 hover:bg-surface-alt/60">
                        <td className="px-3 py-2 font-medium">{player.name}</td>
                        <td className="px-3 py-2 text-muted">{player.clubShort}</td>
                        <td className="px-3 py-2 text-muted">{player.position}</td>
                        <td className="px-3 py-2">{player.price.toFixed(1)}M</td>
                        <td className="px-3 py-2 text-right">
                          {inSquad ? (
                            <button
                              onClick={() => removePlayer(player.id)}
                              className="rounded-md border border-danger px-2 py-1 text-xs font-semibold text-danger hover:bg-danger/10"
                            >
                              Quitar
                            </button>
                          ) : (
                            <button
                              onClick={() => addPlayer(player)}
                              disabled={!!blocked}
                              title={blocked ?? undefined}
                              className="rounded-md bg-primary px-2 py-1 text-xs font-semibold text-white hover:bg-primary-light disabled:opacity-30"
                            >
                              Agregar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3">
            {POSITION_ORDER.map((pos) => (
              <div key={pos} className="rounded-xl border border-border bg-surface p-3">
                <p className="mb-2 text-xs font-semibold uppercase text-muted">
                  {POSITION_LABEL[pos]} ({countByPosition[pos]}/{SQUAD_COMPOSITION[pos]})
                </p>
                <div className="space-y-1">
                  {squadPlayers
                    .filter((p) => p.position === pos)
                    .map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-sm">
                        <span>{p.name}</span>
                        <span className="text-muted">{p.price.toFixed(1)}M</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="pitch-bg rounded-xl border border-border p-4">
            {POSITION_ORDER.map((pos) => (
              <div key={pos} className="mb-4 flex flex-wrap justify-center gap-3 last:mb-0">
                {startingPlayers
                  .filter((p) => p.position === pos)
                  .map((p) => (
                    <PlayerChip
                      key={p.id}
                      player={p}
                      isCaptain={squad.get(p.id)?.isCaptain ?? false}
                      isViceCaptain={squad.get(p.id)?.isViceCaptain ?? false}
                      onBench={() => toggleStarting(p)}
                      onCaptain={() => setCaptain(p.id)}
                      onViceCaptain={() => setViceCaptain(p.id)}
                    />
                  ))}
                {startingCountByPosition[pos] === 0 && (
                  <p className="text-xs text-white/70">Sin {POSITION_LABEL[pos].toLowerCase()}s titulares</p>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="mb-2 text-xs font-semibold uppercase text-muted">
              Banca ({benchPlayers.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {benchPlayers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggleStarting(p)}
                  className="rounded-md border border-border bg-surface-alt px-3 py-2 text-sm hover:border-primary-light"
                >
                  {p.name}{" "}
                  <span className="text-muted">({p.position})</span>
                </button>
              ))}
              {benchPlayers.length === 0 && (
                <p className="text-sm text-muted">No tienes jugadores en la banca.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar equipo"}
        </button>
      </div>
    </div>
  );
}

function PlayerChip({
  player,
  isCaptain,
  isViceCaptain,
  onBench,
  onCaptain,
  onViceCaptain,
}: {
  player: PlayerVM;
  isCaptain: boolean;
  isViceCaptain: boolean;
  onBench: () => void;
  onCaptain: () => void;
  onViceCaptain: () => void;
}) {
  return (
    <div className="flex w-28 flex-col items-center rounded-lg bg-surface/95 p-2 text-center shadow">
      <div className="relative mb-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
        {isCaptain ? "C" : isViceCaptain ? "V" : player.position}
      </div>
      <p className="w-full truncate text-xs font-semibold">{player.name}</p>
      <p className="text-[10px] text-muted">{player.clubShort}</p>
      <div className="mt-1 flex gap-1">
        <button
          onClick={onCaptain}
          title="Hacer capitán"
          className={`rounded px-1 text-[10px] font-bold ${
            isCaptain ? "bg-accent text-white" : "bg-surface-alt text-muted hover:text-foreground"
          }`}
        >
          C
        </button>
        <button
          onClick={onViceCaptain}
          title="Hacer vicecapitán"
          className={`rounded px-1 text-[10px] font-bold ${
            isViceCaptain ? "bg-accent text-white" : "bg-surface-alt text-muted hover:text-foreground"
          }`}
        >
          V
        </button>
        <button
          onClick={onBench}
          title="Enviar a la banca"
          className="rounded bg-surface-alt px-1 text-[10px] text-muted hover:text-foreground"
        >
          ⇩
        </button>
      </div>
    </div>
  );
}
