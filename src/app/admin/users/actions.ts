"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import type { Role } from "@prisma/client";

export async function updateUserRole(userId: string, role: Role) {
  const admin = await requireRole(["ADMIN"]);

  if (admin.id === userId && role !== "ADMIN") {
    return { ok: false as const, error: "No puedes quitarte tu propio rol de administrador." };
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
  return { ok: true as const };
}
