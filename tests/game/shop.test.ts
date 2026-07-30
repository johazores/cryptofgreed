import test from "node:test";
import assert from "node:assert/strict";
import {
  EQUIPMENT_SLOTS,
  findShopItem,
  getShopInventory,
  getShopTierIndex,
} from "../../lib/game/shop.ts";

test("shop inventory is deterministic and provides one item per slot", () => {
  const first = getShopInventory(7);
  const second = getShopInventory(7);

  assert.deepEqual(first, second);
  assert.equal(first.length, EQUIPMENT_SLOTS.length);
  assert.deepEqual(
    first.map((item) => item.slot),
    [...EQUIPMENT_SLOTS]
  );
  assert.equal(new Set(first.map((item) => item.id)).size, first.length);
});

test("shop tier scales every four floors and caps at T5", () => {
  assert.equal(getShopTierIndex(1), 0);
  assert.equal(getShopTierIndex(4), 0);
  assert.equal(getShopTierIndex(5), 1);
  assert.equal(getShopTierIndex(999), 5);
});

test("shop items can only be resolved for the current floor tier", () => {
  const item = getShopInventory(1)[0];

  assert.deepEqual(findShopItem(1, item.id), item);
  assert.equal(findShopItem(9, item.id), null);
});
