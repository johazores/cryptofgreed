import test from "node:test";
import assert from "node:assert/strict";
import {
  getCharacterCreationError,
  isFightingStyle,
  normalizeCharacterName,
} from "../../lib/game/character-creation.ts";

test("character names are normalized before storage", () => {
  assert.equal(normalizeCharacterName("  The   Delver  "), "The Delver");
});

test("character creation validates name and class", () => {
  assert.match(getCharacterCreationError("ab", "MELEE") || "", /at least/);
  assert.match(getCharacterCreationError("Bad@Name", "MELEE") || "", /only use/);
  assert.equal(getCharacterCreationError("Iron Vale", "MELEE"), null);
  assert.equal(isFightingStyle("MAGIC"), true);
  assert.equal(isFightingStyle("ROGUE"), false);
});
