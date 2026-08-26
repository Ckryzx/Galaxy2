import type { PrismaClient, Position } from "@prisma/client";
import { BUDGET, MAX_PER_CLUB, SQUAD_COMPOSITION } from "@/lib/squadRules";

const FORMATION: Record<Position, number> = { GK: 1, DEF: 4, MID: 4, FWD: 2 };

type Candidate = { id: string; position: Position; clubId: string; price: number };

async function pickDefaultSquad(prisma: PrismaClient): Promise<Candidate[]> {
  const clubCount: Record<string, number> = {};
  let totalCost = 0;
  const picks: Candidate[] = [];

  for (const position of Object.keys(SQUAD_COMPOSITION) as Position[]) {
    const needed = SQUAD_COMPOSITION[position];
    const candidates = await prisma.player.findMany({
      where: { position },
      orderBy: { price: "asc" },
      select: { id: true, position: true, clubId: true, price: true },
    });

    let taken = 0;
    for (const candidate of candidates) {
      if (taken >= needed) break;
      const clubUsed = clubCount[candidate.clubId] ?? 0;
      if (clubUsed >= MAX_PER_CLUB) continue;
      if (totalCost + candidate.price > BUDGET) continue;

      picks.push(candidate);
      clubCount[candidate.clubId] = clubUsed + 1;
      totalCost += candidate.price;
      taken += 1;
    }
  }

  return picks;
}

function pickStartingXI(picks: Candidate[]): { starterIds: Set<string>; captainId: string | null; viceCaptainId: string | null } {
  const starterIds = new Set<string>();

  for (const position of Object.keys(FORMATION) as Position[]) {
    const byPricier = picks
      .filter((p) => p.position === position)
      .sort((a, b) => b.price - a.price)
      .slice(0, FORMATION[position]);
    for (const p of byPricier) starterIds.add(p.id);
  }

  const starters = picks.filter((p) => starterIds.has(p.id)).sort((a, b) => b.price - a.price);
  const captainId = starters[0]?.id ?? null;
  const viceCaptainId = starters[1]?.id ?? null;

  return { starterIds, captainId, viceCaptainId };
}

export async function createFantasyTeamWithDefaultSquad(
  prisma: PrismaClient,
  userId: string,
  name: string,
) {
  const team = await prisma.fantasyTeam.create({ data: { userId, name } });

  const picks = await pickDefaultSquad(prisma);
  const totalNeeded = Object.values(SQUAD_COMPOSITION).reduce((a, b) => a + b, 0);
  if (picks.length !== totalNeeded) return team;

  const { starterIds, captainId, viceCaptainId } = pickStartingXI(picks);

  await prisma.squadPlayer.createMany({
    data: picks.map((p, index) => ({
      fantasyTeamId: team.id,
      playerId: p.id,
      isStarting: starterIds.has(p.id),
      isCaptain: p.id === captainId,
      isViceCaptain: p.id === viceCaptainId,
      slotOrder: index,
    })),
  });

  return team;
}
