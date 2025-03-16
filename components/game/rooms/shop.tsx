"use client";
import { useCharacter } from "@/context/character-context";
import CharacterStats from "../character-stats";
import Button from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ItemTier, EquipmentSlot } from "@prisma/client";
import { GiShop } from "react-icons/gi";

interface ShopProps {
  onContinue: () => void;
}

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

export default function Shop({ onContinue }: ShopProps) {
  const { character, updateCharacter } = useCharacter();
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

      // Update character's gold
      await updateCharacter(character.id, {
        gold: character.gold - item.price,
      });

      toast.success("Item purchased successfully!");
    } catch (error) {
      toast.error("Failed to purchase item");
    }
  };

  const handleContinue = async () => {
    if (!character) return;
    onContinue(); // This will trigger handleContinue in the parent component
  };

  if (!character) return null;

  return (
    <>
      <div className="container mx-auto max-w-7xl p-6 h-screen overflow-y-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <GiShop className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-medievalsharp">
                Merchant&apos;s Shop
              </h2>
            </div>
            <div className="text-yellow-600 font-medievalsharp text-xl">
              Gold: {character.gold}
            </div>
          </div>

          <div className="mb-6">
            <CharacterStats character={character} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {shopItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-primary transition-colors duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medievalsharp text-lg text-gray-900">
                    {item.name}
                  </h3>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
                    {item.price} Gold
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                <div className="text-sm text-gray-700 mb-4 space-y-1">
                  {item.stats.attack && (
                    <div className="flex items-center gap-2">
                      <span className="text-red-600">Attack:</span> +
                      {item.stats.attack}
                    </div>
                  )}
                  {item.stats.defense && (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">Defense:</span> +
                      {item.stats.defense}
                    </div>
                  )}
                  {item.stats.health && (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">Health:</span> +
                      {item.stats.health}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => handlePurchase(item)}
                  disabled={character.gold < item.price}
                  fullWidth
                  variant={character.gold >= item.price ? "primary" : "ghost"}
                  size="md"
                >
                  {character.gold >= item.price
                    ? "Purchase"
                    : "Not enough gold"}
                </Button>
              </div>
            ))}
          </div>

          <div className="w-full my-6 pb-10">
            <Button
              onClick={handleContinue}
              variant="primary"
              fullWidth
              size="lg"
              className="font-medievalsharp"
            >
              Continue to Next Floor
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
