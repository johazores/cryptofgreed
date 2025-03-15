"use client";
import { useCharacter } from "@/context/character-context";
import { useRouter } from "next/navigation";
import { handleContinueToNextRoom } from "@/lib/game/room-navigation";
import CharacterStats from "./character-stats";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ItemTier, EquipmentSlot } from "@prisma/client";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  slot: EquipmentSlot;
  tier: ItemTier;
  price: number;
  stats: {
    attack?: number;
    defense?: number;
    health?: number;
  };
}

export default function Shop() {
  const { character, updateCharacter } = useCharacter();
  const router = useRouter();
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);

  useEffect(() => {
    // Generate shop items based on character's floor level
    if (!character) return;

    const generateShopItems = () => {
      const floor = character.floor || 1;
      const itemCount = 6; // Number of items to show in shop
      const items: ShopItem[] = [];

      // Generate items based on floor level
      for (let i = 0; i < itemCount; i++) {
        const tier = Math.min(Math.floor(floor / 5), 4) as number; // Cap at T4
        const basePrice = 50 * (tier + 1);
        const slots = Object.values(EquipmentSlot);
        const randomSlot = slots[Math.floor(Math.random() * slots.length)];

        items.push({
          id: `shop-item-${i}`,
          name: `${Object.values(ItemTier)[tier]} ${randomSlot.toLowerCase()}`,
          description: `A ${Object.values(ItemTier)[
            tier
          ].toLowerCase()} tier item`,
          slot: randomSlot,
          tier: Object.values(ItemTier)[tier] as ItemTier,
          price: basePrice + Math.floor(Math.random() * basePrice * 0.5),
          stats: {
            attack:
              randomSlot === EquipmentSlot.WEAPON ? (tier + 1) * 5 : undefined,
            defense: ["HELMET", "ARMOR", "BOOTS"].includes(randomSlot)
              ? (tier + 1) * 3
              : undefined,
            health: ["HELMET", "ARMOR", "BOOTS"].includes(randomSlot)
              ? (tier + 1) * 10
              : undefined,
          },
        });
      }

      return items;
    };

    setShopItems(generateShopItems());
  }, [character]);

  const handlePurchase = async (item: ShopItem) => {
    if (!character) return;

    if (character.gold < item.price) {
      toast.error("Not enough gold!");
      return;
    }

    try {
      // Create new equipment
      const response = await fetch("/api/character/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: character.id,
          equipment: {
            name: item.name,
            description: item.description,
            slot: item.slot,
            tier: item.tier,
            stats: item.stats,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to purchase item");

      // Update character's gold using updateCharacter instead
      await updateCharacter(character.id, {
        gold: character.gold - item.price,
      });

      toast.success("Item purchased successfully!");
    } catch (error) {
      toast.error("Failed to purchase item");
    }
  };

  const handleContinue = () => handleContinueToNextRoom(character, router);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-medievalsharp mb-4">Shop</h2>
      <div className="mb-6">
        {character && <CharacterStats character={character} />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {shopItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg p-4 shadow-md border border-gray-200"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medievalsharp text-lg">{item.name}</h3>
              <span className="text-yellow-600 font-bold">
                {item.price} Gold
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
            <div className="text-sm text-gray-700 mb-3">
              {item.stats.attack && <div>Attack: +{item.stats.attack}</div>}
              {item.stats.defense && <div>Defense: +{item.stats.defense}</div>}
              {item.stats.health && <div>Health: +{item.stats.health}</div>}
            </div>
            <button
              onClick={() => handlePurchase(item)}
              disabled={!character || character.gold < item.price}
              className={`w-full p-2 rounded ${
                character && character.gold >= item.price
                  ? "bg-primary hover:bg-primary-dark text-white"
                  : "bg-gray-300 cursor-not-allowed text-gray-600"
              }`}
            >
              Purchase
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={handleContinue}
        className="w-full p-4 bg-primary hover:bg-primary-dark text-white rounded-lg"
      >
        Continue to Next Floor
      </button>
    </div>
  );
}
