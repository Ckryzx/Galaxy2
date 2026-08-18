"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { validateFullSquad, validateStartingXI } from "@/lib/squadRules";

export type SaveSquadPayload = {
  playerIds: string[];
  startingIds: string[];
  captainId: string | null;
  viceCaptainId: string | null;
};

export type SaveSquadResult = { ok: true } | { ok: false; errors: string[] };

export async function saveSquad(payload: SaveSquadPayload): Promise<SaveSquadResult> {
  const user = await requireUser();

  const uniqueIds = Array.from(new Set(payload.playerIds));
  const players = await prisma.player.findMany({
    where: { id: { in: uniqueIds } },
    select: { id: true, position: true, clubId: true, price: true },
  });

  if (players.length !== uniqueIds.length) {
    return { ok: false, errors: ["Algunos jugadores seleccionados ya no existen."] };
  }

  const squadErrors = validateFullSquad(
    players.map((p) => ({ playerId: p.id, position: p.position, clubId: p.clubId, price: p.price })),
  );

  const startingPlayers = players
    .filter((p) => payload.startingIds.includes(p.id))
    .map((p) => ({ playerId: p.id, position: p.position }));

  const startingErrors = validateStartingXI(startingPlayers, payload.captainId, payload.viceCaptainId);

  const errors = [...squadErrors, ...startingErrors];
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  let team = await prisma.fantasyTeam.findUnique({ where: { userId: user.id } });
  if (!team) {
    team = await prisma.fantasyTeam.create({
      data: { userId: user.id, name: `Equipo de ${user.name}` },
    });
  }

  const teamId = team.id;

  await prisma.$transaction([
    prisma.squadPlayer.deleteMany({ where: { fantasyTeamId: teamId } }),
    prisma.squadPlayer.createMany({
      data: uniqueIds.map((playerId, index) => ({
        fantasyTeamId: teamId,
        playerId,
        isStarting: payload.startingIds.includes(playerId),
        isCaptain: playerId === payload.captainId,
        isViceCaptain: playerId === payload.viceCaptainId,
        slotOrder: index,
      })),
    }),
  ]);

  revalidatePath("/team");
  return { ok: true };
}

export async function renameTeam(name: string): Promise<SaveSquadResult> {
  const user = await requireUser();
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 40) {
    return { ok: false, errors: ["El nombre del equipo debe tener entre 2 y 40 caracteres."] };
  }

  const team = await prisma.fantasyTeam.findUnique({ where: { userId: user.id } });
  if (!team) return { ok: false, errors: ["No tienes un equipo todavía."] };

  await prisma.fantasyTeam.update({ where: { id: team.id }, data: { name: trimmed } });
  revalidatePath("/team");
  return { ok: true };
}
