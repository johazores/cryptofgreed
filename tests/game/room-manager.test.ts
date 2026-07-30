import test from "node:test";
import assert from "node:assert/strict";
import { createSeededRandom } from "../../lib/game/random.ts";
import {
  getNextFloor,
  getRoomChoices,
  isForcedRestFloor,
} from "../../lib/game/room-manager.ts";

test("room choices are unique and deterministic for a seed", () => {
  const first = getRoomChoices(createSeededRandom(42));
  const second = getRoomChoices(createSeededRandom(42));

  assert.deepEqual(first, second);
  assert.equal(first.length, 2);
  assert.equal(new Set(first).size, 2);
});

test("floor progression and forced rest rules are explicit", () => {
  assert.equal(getNextFloor(1), 2);
  assert.equal(getNextFloor(0), 2);
  assert.equal(isForcedRestFloor(5), true);
  assert.equal(isForcedRestFloor(10), true);
  assert.equal(isForcedRestFloor(6), false);
});
