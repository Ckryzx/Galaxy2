"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import type { Position } from "@prisma/client";

export type PlayerVM = { id: string; name: string; position: Position; price: number; clubId: string };

export type PlayerFormResult = { ok: true } | { ok: false; error: string };
export type CreatePlayerResult = { ok: true; player: PlayerVM } | { ok: false; error: string };

function validatePlayerInput(name: string, price: number) {
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 60) {
    return "El nombre debe tener entre 2 y 60 caracteres.";
  }
  if (!Number.isFinite(price) || price < 3 || price > 20) {
    return "El precio debe ser un número entre 3 y 20 (millones).";
  }
  return null;
}

export async function createPlayer(input: {
  name: string;
  position: Position;
  price: number;
  clubId: string;
}): Promise<CreatePlayerResult> {
  await requireRole(["ADMIN"]);

  const error = validatePlayerInput(input.name, input.price);
  if (error) return { ok: false, error };

  const player = await prisma.player.create({
    data: {
      name: input.name.trim(),
      position: input.position,
      price: Math.round(input.price * 10) / 10,
      clubId: input.clubId,
    },
  });

  revalidatePath("/admin/players");
  revalidatePath("/players");
  revalidatePath("/team");
  return {
    ok: true,
    player: {
      id: player.id,
      name: player.name,
      position: player.position,
      price: player.price,
      clubId: player.clubId,
    },
  };
}

export async function updatePlayer(
  playerId: string,
  input: { name: string; position: Position; price: number; clubId: string },
): Promise<PlayerFormResult> {
  await requireRole(["ADMIN"]);

  const error = validatePlayerInput(input.name, input.price);
  if (error) return { ok: false, error };

  await prisma.player.update({
    where: { id: playerId },
    data: {
      name: input.name.trim(),
      position: input.position,
      price: Math.round(input.price * 10) / 10,
      clubId: input.clubId,
    },
  });

  revalidatePath("/admin/players");
  revalidatePath("/players");
  revalidatePath("/team");
  return { ok: true };
}

export async function deletePlayer(playerId: string): Promise<PlayerFormResult> {
  await requireRole(["ADMIN"]);

  const squadCount = await prisma.squadPlayer.count({ where: { playerId } });
  if (squadCount > 0) {
    return {
      ok: false,
      error: `No se puede borrar: ${squadCount} equipo(s) tienen a este jugador en su plantilla. Sácalo de esos equipos primero, o solo edítalo.`,
    };
  }

  await prisma.player.delete({ where: { id: playerId } });

  revalidatePath("/admin/players");
  revalidatePath("/players");
  revalidatePath("/team");
  return { ok: true };
}
