export const REVIVE_COST = 100;

export type RevivalBlockReason =
  | "CHARACTER_ALREADY_ALIVE"
  | "INSUFFICIENT_CRYSTALS";

export function getRevivalBlockReason(
  isDead: boolean,
  crystals: number
): RevivalBlockReason | null {
  if (!isDead) return "CHARACTER_ALREADY_ALIVE";
  if (crystals < REVIVE_COST) return "INSUFFICIENT_CRYSTALS";
  return null;
}
