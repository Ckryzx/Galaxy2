"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { createFantasyTeamWithDefaultSquad } from "@/lib/defaultSquad";

function randomCode(length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

async function ensureTeam(userId: string, userName: string) {
  let team = await prisma.fantasyTeam.findUnique({ where: { userId } });
  if (!team) {
    team = await createFantasyTeamWithDefaultSquad(prisma, userId, `Equipo de ${userName}`);
  }
  return team;
}

export async function createLeague(name: string) {
  const user = await requireUser();
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 40) {
    return { ok: false as const, error: "El nombre de la liga debe tener entre 2 y 40 caracteres." };
  }

  const team = await ensureTeam(user.id, user.name ?? "Manager");

  let code = randomCode();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const existing = await prisma.league.findUnique({ where: { code } });
    if (!existing) break;
    code = randomCode();
  }

  const league = await prisma.league.create({
    data: {
      name: trimmed,
      code,
      ownerId: user.id,
      members: { create: { userId: user.id, fantasyTeamId: team.id } },
    },
  });

  revalidatePath("/leagues");
  return { ok: true as const, code: league.code, id: league.id };
}

export async function joinLeague(code: string) {
  const user = await requireUser();
  const normalized = code.trim().toUpperCase();

  const league = await prisma.league.findUnique({ where: { code: normalized } });
  if (!league) {
    return { ok: false as const, error: "No existe ninguna liga con ese código." };
  }

  const team = await ensureTeam(user.id, user.name ?? "Manager");

  const existingMembership = await prisma.leagueMember.findUnique({
    where: { leagueId_fantasyTeamId: { leagueId: league.id, fantasyTeamId: team.id } },
  });
  if (existingMembership) {
    return { ok: false as const, error: "Ya eres parte de esta liga." };
  }

  await prisma.leagueMember.create({
    data: { leagueId: league.id, userId: user.id, fantasyTeamId: team.id },
  });

  revalidatePath("/leagues");
  return { ok: true as const, id: league.id };
}
