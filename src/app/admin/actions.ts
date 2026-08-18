"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { recomputeGameweekScores } from "@/lib/scoring";
import type { GameweekStatus } from "@prisma/client";

export async function saveRatings(
  gameweekId: string,
  ratings: { playerId: string; rating: number }[],
) {
  const user = await requireRole(["STREAMER", "ADMIN"]);

  const clean = ratings.filter(
    (r) => Number.isFinite(r.rating) && r.rating >= 0 && r.rating <= 10,
  );

  if (clean.length === 0) {
    return { ok: false as const, error: "No hay notas válidas para guardar." };
  }

  await prisma.$transaction(
    clean.map((r) =>
      prisma.playerRating.upsert({
        where: { playerId_gameweekId: { playerId: r.playerId, gameweekId } },
        create: { playerId: r.playerId, gameweekId, rating: r.rating, ratedById: user.id },
        update: { rating: r.rating, ratedById: user.id },
      }),
    ),
  );

  revalidatePath("/admin");
  return { ok: true as const, count: clean.length };
}

export async function finalizeGameweek(gameweekId: string) {
  await requireRole(["STREAMER", "ADMIN"]);
  const teamsUpdated = await recomputeGameweekScores(gameweekId);
  await prisma.gameweek.update({ where: { id: gameweekId }, data: { status: "FINISHED" } });

  revalidatePath("/admin");
  revalidatePath("/points");
  revalidatePath("/ranking");
  revalidatePath("/leagues");
  return { ok: true as const, teamsUpdated };
}

export async function setGameweekStatus(gameweekId: string, status: GameweekStatus) {
  await requireRole(["STREAMER", "ADMIN"]);
  await prisma.gameweek.update({ where: { id: gameweekId }, data: { status } });
  revalidatePath("/admin");
}
