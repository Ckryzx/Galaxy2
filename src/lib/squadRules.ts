import { Position } from "@prisma/client";

export const BUDGET = 100;
export const MAX_PER_CLUB = 3;
export const SQUAD_COMPOSITION: Record<Position, number> = {
  GK: 2,
  DEF: 5,
  MID: 5,
  FWD: 3,
};
export const SQUAD_SIZE = Object.values(SQUAD_COMPOSITION).reduce((a, b) => a + b, 0);
export const STARTING_SIZE = 11;

export const STARTING_LIMITS: Record<Position, { min: number; max: number }> = {
  GK: { min: 1, max: 1 },
  DEF: { min: 3, max: 5 },
  MID: { min: 2, max: 5 },
  FWD: { min: 1, max: 3 },
};

export type SquadPick = {
  playerId: string;
  position: Position;
  clubId: string;
  price: number;
};

export function validateFullSquad(picks: SquadPick[]): string[] {
  const errors: string[] = [];

  if (picks.length !== SQUAD_SIZE) {
    errors.push(`La plantilla debe tener exactamente ${SQUAD_SIZE} jugadores (tienes ${picks.length}).`);
  }

  const byPosition: Record<Position, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  const byClub: Record<string, number> = {};
  let totalCost = 0;

  for (const pick of picks) {
    byPosition[pick.position] += 1;
    byClub[pick.clubId] = (byClub[pick.clubId] ?? 0) + 1;
    totalCost += pick.price;
  }

  for (const position of Object.keys(SQUAD_COMPOSITION) as Position[]) {
    if (byPosition[position] !== SQUAD_COMPOSITION[position]) {
      errors.push(
        `Debes tener ${SQUAD_COMPOSITION[position]} jugadores en posición ${position} (tienes ${byPosition[position]}).`,
      );
    }
  }

  for (const count of Object.values(byClub)) {
    if (count > MAX_PER_CLUB) {
      errors.push(`No puedes tener más de ${MAX_PER_CLUB} jugadores del mismo club.`);
      break;
    }
  }

  if (totalCost > BUDGET) {
    errors.push(`Tu plantilla cuesta ${totalCost.toFixed(1)}M, superando el presupuesto de ${BUDGET}M.`);
  }

  return errors;
}

export function validateStartingXI(
  starters: { playerId: string; position: Position }[],
  captainId: string | null,
  viceCaptainId: string | null,
): string[] {
  const errors: string[] = [];

  if (starters.length !== STARTING_SIZE) {
    errors.push(`El once titular debe tener ${STARTING_SIZE} jugadores (tienes ${starters.length}).`);
  }

  const byPosition: Record<Position, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  for (const starter of starters) {
    byPosition[starter.position] += 1;
  }

  for (const position of Object.keys(STARTING_LIMITS) as Position[]) {
    const { min, max } = STARTING_LIMITS[position];
    if (byPosition[position] < min || byPosition[position] > max) {
      errors.push(
        `Formación inválida: necesitas entre ${min} y ${max} jugadores en posición ${position} (tienes ${byPosition[position]}).`,
      );
    }
  }

  if (!captainId) {
    errors.push("Debes elegir un capitán.");
  } else if (!starters.some((s) => s.playerId === captainId)) {
    errors.push("El capitán debe estar en el once titular.");
  }

  if (!viceCaptainId) {
    errors.push("Debes elegir un vicecapitán.");
  } else if (!starters.some((s) => s.playerId === viceCaptainId)) {
    errors.push("El vicecapitán debe estar en el once titular.");
  }

  if (captainId && viceCaptainId && captainId === viceCaptainId) {
    errors.push("El capitán y el vicecapitán deben ser jugadores distintos.");
  }

  return errors;
}
