export const EQUIPMENT_SLOTS = ["WEAPON", "HELMET", "ARMOR", "BOOTS"] as const;
export const ITEM_TIERS = ["T0", "T1", "T2", "T3", "T4", "T5"] as const;

export type EquipmentSlotValue = (typeof EQUIPMENT_SLOTS)[number];
export type ItemTierValue = (typeof ITEM_TIERS)[number];

export type ShopItemStats = {
  attack?: number;
  defense?: number;
  health?: number;
};

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  slot: EquipmentSlotValue;
  tier: ItemTierValue;
  price: number;
  stats: ShopItemStats;
};

const TIER_NAMES = ["Worn", "Iron", "Runed", "Gilded", "Relic", "Mythic"] as const;

const SLOT_DETAILS: Record<
  EquipmentSlotValue,
  { name: string; description: string; priceOffset: number }
> = {
  WEAPON: {
    name: "Crypt Blade",
    description: "A balanced weapon built for reliable damage.",
    priceOffset: 18,
  },
  HELMET: {
    name: "Graveguard Helm",
    description: "Protects the delver and strengthens defensive cards.",
    priceOffset: 10,
  },
  ARMOR: {
    name: "Vault Cuirass",
    description: "Heavy protection for surviving deeper floors.",
    priceOffset: 14,
  },
  BOOTS: {
    name: "Dustwalker Boots",
    description: "Light protection for navigating unstable chambers.",
    priceOffset: 6,
  },
};

export function getShopTierIndex(floor: number): number {
  const safeFloor = Math.max(1, Math.floor(floor || 1));
  return Math.min(ITEM_TIERS.length - 1, Math.floor((safeFloor - 1) / 4));
}

function getStats(slot: EquipmentSlotValue, tierIndex: number): ShopItemStats {
  const scale = tierIndex + 1;

  switch (slot) {
    case "WEAPON":
      return { attack: 4 + scale * 3 };
    case "HELMET":
      return { defense: 1 + scale };
    case "ARMOR":
      return { defense: 2 + scale * 2 };
    case "BOOTS":
      return { defense: 1 + tierIndex };
  }
}

export function getShopInventory(floor: number): ShopItem[] {
  const tierIndex = getShopTierIndex(floor);
  const tier = ITEM_TIERS[tierIndex];
  const tierName = TIER_NAMES[tierIndex];
  const basePrice = 28 + (tierIndex + 1) * 24;

  return EQUIPMENT_SLOTS.map((slot) => {
    const details = SLOT_DETAILS[slot];

    return {
      id: `${tier.toLowerCase()}-${slot.toLowerCase()}`,
      name: `${tierName} ${details.name}`,
      description: details.description,
      slot,
      tier,
      price: basePrice + details.priceOffset,
      stats: getStats(slot, tierIndex),
    };
  });
}

export function findShopItem(floor: number, itemId: string): ShopItem | null {
  return getShopInventory(floor).find((item) => item.id === itemId) ?? null;
}
