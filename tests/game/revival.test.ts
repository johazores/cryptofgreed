import test from "node:test";
import assert from "node:assert/strict";
import {
  getRevivalBlockReason,
  REVIVE_COST,
} from "../../lib/game/revival.ts";

test("revival rejects living characters", () => {
  assert.equal(
    getRevivalBlockReason(false, REVIVE_COST),
    "CHARACTER_ALREADY_ALIVE"
  );
});

test("revival rejects insufficient crystals", () => {
  assert.equal(
    getRevivalBlockReason(true, REVIVE_COST - 1),
    "INSUFFICIENT_CRYSTALS"
  );
});

test("revival allows a dead character with enough crystals", () => {
  assert.equal(getRevivalBlockReason(true, REVIVE_COST), null);
});
