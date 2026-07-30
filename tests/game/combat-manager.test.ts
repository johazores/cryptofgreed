import test from "node:test";
import assert from "node:assert/strict";
import { CombatManager } from "../../lib/game/combat-manager.ts";
import type { Card } from "../../lib/cards";
import type { Enemy } from "../../lib/game/enemy";
import type { GameState } from "../../lib/game/game-state";

const strike: Card = {
  id: "strike",
  name: "Strike",
  description: "Deal 6 damage.",
  type: "ATTACK",
  energy: 1,
  effects: { damage: 6 },
};

function createState(): GameState {
  return {
    floor: 1,
    character: {
      id: "character-1",
      name: "Test",
      class: "MELEE",
      floor: 1,
      level: 1,
      experience: 0,
      currentHealth: 100,
      maxHealth: 100,
      energy: 3,
      gold: 0,
      equipment: [],
      powers: [],
      isDead: false,
      block: 0,
      deck: [],
      hand: [],
      discardPile: [],
      monstersSlain: 0,
      userId: "user-1",
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
    currentEnergy: 3,
    maxEnergy: 3,
    deck: [strike],
    hand: [strike],
    discardPile: [],
    drawPile: [strike, strike, strike, strike, strike],
    block: 2,
    status: "PLAYING",
  };
}

function createEnemy(health = 20): Enemy {
  return {
    id: "skeleton",
    name: "Skeleton",
    currentHealth: health,
    maxHealth: health,
    block: 0,
    intent: {
      type: "ATTACK",
      value: 6,
      description: "Attack for 6",
    },
    isElite: false,
    isBoss: false,
  };
}

test("endTurn resolves exactly one enemy turn and starts the next player turn", () => {
  const manager = new CombatManager(createState(), [createEnemy()]);

  assert.equal(
    manager.getState().hand.length,
    1,
    "the constructor must not draw a second opening hand"
  );
  assert.equal(manager.endTurn(), true);

  const state = manager.getState();
  const combat = manager.getCombatState();

  assert.equal(
    state.character.currentHealth,
    96,
    "2 block absorbs part of one 6-damage attack"
  );
  assert.equal(state.block, 0);
  assert.equal(combat.turn, 2);
  assert.equal(combat.isPlayerTurn, true);
});

test("defeated enemies remain available for victory rewards", () => {
  const state = createState();
  state.hand = [
    {
      ...strike,
      effects: { damage: 20 },
    },
  ];
  const manager = new CombatManager(state, [createEnemy(20)]);

  assert.equal(manager.playCard(0, 0), true);
  assert.equal(manager.getState().status, "VICTORY");
  assert.equal(manager.getCombatState().enemies.length, 0);
  assert.equal(manager.getCombatState().defeatedEnemies.length, 1);
});
