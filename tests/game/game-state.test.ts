import test from "node:test";
import assert from "node:assert/strict";
import { GameManager } from "../../lib/game/game-state.ts";
import { createSeededRandom } from "../../lib/game/random.ts";
import type { Character } from "../../types/character";

function createCharacter(): Character {
  return {
    id: "character-1",
    name: "Test",
    class: "MELEE",
    floor: 7,
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
  };
}

test("game initialization preserves the persisted floor and draws five cards", () => {
  const state = new GameManager(
    createCharacter(),
    createSeededRandom(7)
  ).getState();

  assert.equal(state.floor, 7);
  assert.equal(state.hand.length, 5);
  assert.equal(state.hand.length + state.drawPile.length, state.deck.length);
});
