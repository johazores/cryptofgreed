import test from "node:test";
import assert from "node:assert/strict";
import { createSeededRandom, shuffle } from "../../lib/game/random.ts";

test("shuffle is deterministic for the same seed", () => {
  const source = [1, 2, 3, 4, 5, 6];
  const first = shuffle(source, createSeededRandom(42));
  const second = shuffle(source, createSeededRandom(42));

  assert.deepEqual(first, second);
  assert.deepEqual(source, [1, 2, 3, 4, 5, 6]);
});
