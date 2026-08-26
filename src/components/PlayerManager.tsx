"use client";

import { useMemo, useState } from "react";
import type { Position } from "@prisma/client";
import { createPlayer, updatePlayer, deletePlayer } from "@/app/admin/players/actions";

type PlayerVM = { id: string; name: string; position: Position; price: number; clubId: string };
type ClubVM = { id: string; name: string; shortName: string };

const POSITIONS: Position[] = ["GK", "DEF", "MID", "FWD"];

export function PlayerManager({ players, clubs }: { players: PlayerVM[]; clubs: ClubVM[] }) {
  const [rows, setRows] = useState(players);
  const [search, setSearch] = useState("");
  const [clubFilter, setClubFilter] = useState("ALL");
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const [newPlayer, setNewPlayer] = useState({
    name: "",
    position: "MID" as Position,
    price: "6.0",
    clubId: clubs[0]?.id ?? "",
  });
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(
    () =>
      rows.filter((p) => {
        if (clubFilter !== "ALL" && p.clubId !== clubFilter) return false;
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [rows, clubFilter, search],
  );

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setCreating(true);
    setFeedback(null);
    const result = await createPlayer({
      name: newPlayer.name,
      position: newPlayer.position,
      price: Number(newPlayer.price),
      clubId: newPlayer.clubId,
    });
    setCreating(false);

    if (result.ok) {
      setFeedback({ type: "ok", text: "Jugador agregado." });
      setNewPlayer({ name: "", position: "MID", price: "6.0", clubId: clubs[0]?.id ?? "" });
      setRows((prev) => [...prev, result.player]);
    } else {
      setFeedback({ type: "error", text: result.error });
    }
  }

  async function handleDelete(playerId: string) {
    if (!confirm("¿Seguro que quieres borrar este jugador?")) return;
    setFeedback(null);
    const result = await deletePlayer(playerId);
    if (result.ok) {
      setRows((prev) => prev.filter((p) => p.id !== playerId));
      setFeedback({ type: "ok", text: "Jugador borrado." });
    } else {
      setFeedback({ type: "error", text: result.error });
    }
  }

  return (
    <div className="space-y-5">
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

      <form onSubmit={handleCreate} className="rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-3 font-semibold">Agregar jugador</h2>
        <div className="flex flex-wrap gap-2">
          <input
            required
            value={newPlayer.name}
            onChange={(e) => setNewPlayer((p) => ({ ...p, name: e.target.value }))}
            placeholder="Nombre"
            className="min-w-[180px] flex-1 rounded-md border border-border bg-surface-alt px-2 py-1.5 text-sm"
          />
          <select
            value={newPlayer.position}
            onChange={(e) => setNewPlayer((p) => ({ ...p, position: e.target.value as Position }))}
            className="rounded-md border border-border bg-surface-alt px-2 py-1.5 text-sm"
          >
            {POSITIONS.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
          <select
            value={newPlayer.clubId}
            onChange={(e) => setNewPlayer((p) => ({ ...p, clubId: e.target.value }))}
            className="rounded-md border border-border bg-surface-alt px-2 py-1.5 text-sm"
          >
            {clubs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            required
            type="number"
            min={3}
            max={20}
            step={0.1}
            value={newPlayer.price}
            onChange={(e) => setNewPlayer((p) => ({ ...p, price: e.target.value }))}
            className="w-24 rounded-md border border-border bg-surface-alt px-2 py-1.5 text-sm"
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
          >
            {creating ? "Agregando..." : "Agregar"}
          </button>
        </div>
      </form>

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

      <div className="max-h-[600px] overflow-y-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-surface-alt text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Posición</th>
              <th className="px-3 py-2">Club</th>
              <th className="px-3 py-2">Precio</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((player) => (
              <PlayerRow
                key={player.id}
                player={player}
                clubs={clubs}
                onSaved={(updated) =>
                  setRows((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
                }
                onDelete={() => handleDelete(player.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlayerRow({
  player,
  clubs,
  onSaved,
  onDelete,
}: {
  player: PlayerVM;
  clubs: ClubVM[];
  onSaved: (player: PlayerVM) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(player.name);
  const [position, setPosition] = useState<Position>(player.position);
  const [price, setPrice] = useState(String(player.price));
  const [clubId, setClubId] = useState(player.clubId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    name !== player.name ||
    position !== player.position ||
    price !== String(player.price) ||
    clubId !== player.clubId;

  async function handleSave() {
    setSaving(true);
    setError(null);
    const result = await updatePlayer(player.id, { name, position, price: Number(price), clubId });
    setSaving(false);
    if (result.ok) {
      onSaved({ id: player.id, name: name.trim(), position, price: Number(price), clubId });
    } else {
      setError(result.error);
    }
  }

  return (
    <tr className="border-t border-border/60">
      <td className="px-3 py-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-border bg-surface-alt px-2 py-1"
        />
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </td>
      <td className="px-3 py-2">
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value as Position)}
          className="rounded-md border border-border bg-surface-alt px-2 py-1"
        >
          {POSITIONS.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      </td>
      <td className="px-3 py-2">
        <select
          value={clubId}
          onChange={(e) => setClubId(e.target.value)}
          className="rounded-md border border-border bg-surface-alt px-2 py-1"
        >
          {clubs.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          min={3}
          max={20}
          step={0.1}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-20 rounded-md border border-border bg-surface-alt px-2 py-1"
        />
      </td>
      <td className="px-3 py-2 text-right">
        <div className="flex justify-end gap-2">
          {dirty && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-accent px-2 py-1 text-xs font-semibold text-white hover:bg-accent-dark disabled:opacity-50"
            >
              {saving ? "..." : "Guardar"}
            </button>
          )}
          <button
            onClick={onDelete}
            className="rounded-md border border-danger px-2 py-1 text-xs font-semibold text-danger hover:bg-danger/10"
          >
            Borrar
          </button>
        </div>
      </td>
    </tr>
  );
}
