import type { Enemy } from "./enemy";
import type { RandomSource } from "./random.ts";

export type CombatRewards = {
  gold: number;
  experience: number;
  monstersSlain: number;
};

export function calculateCombatRewards(
  defeatedEnemies: readonly Enemy[],
  floor: number,
  random: RandomSource = Math.random
): CombatRewards {
  const normalizedFloor = Math.max(1, Math.floor(floor));
  const floorMultiplier = Math.max(1, Math.floor(normalizedFloor / 5));
  const goldRoll = Math.min(0.999999999, Math.max(0, random()));

  const experience = defeatedEnemies.reduce((total, enemy) => {
    if (enemy.isBoss) return total + 50 * floorMultiplier;
    if (enemy.isElite) return total + 25 * floorMultiplier;
    return total + 10 * floorMultiplier;
  }, 0);

  return {
    gold: Math.floor(goldRoll * 10) + 5,
    experience: Math.max(10, experience),
    monstersSlain: defeatedEnemies.length,
  };
}
