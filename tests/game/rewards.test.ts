import test from "node:test";
import assert from "node:assert/strict";
import { calculateCombatRewards } from "../../lib/game/rewards.ts";
import type { Enemy } from "../../lib/game/enemy";

const normal: Enemy = {
  id: "normal",
  name: "Normal",
  currentHealth: 0,
  maxHealth: 20,
  block: 0,
  intent: { type: "ATTACK", value: 5, description: "" },
  isElite: false,
  isBoss: false,
};
const elite: Enemy = { ...normal, id: "elite", isElite: true };

test("rewards use the defeated enemy ledger", () => {
  const rewards = calculateCombatRewards([normal, elite], 10, () => 0.5);

  assert.deepEqual(rewards, {
    gold: 10,
    experience: 70,
    monstersSlain: 2,
  });
});
