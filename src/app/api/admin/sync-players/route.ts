import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncClubsAndPlayers } from "@/lib/seedData";

export async function POST(request: Request) {
  const secret = process.env.SEED_SECRET;
  const provided = request.headers.get("x-seed-secret");

  if (!secret) {
    return NextResponse.json(
      { error: "SEED_SECRET no está configurado en el servidor." },
      { status: 500 },
    );
  }

  if (provided !== secret) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const result = await syncClubsAndPlayers(prisma);
  return NextResponse.json({ ok: true, ...result });
}
