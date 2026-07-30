"use client";

import { useMemo, useState } from "react";
import { Coins, ShieldCheck, ShoppingBag, Sword, Heart } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import { useCharacter } from "@/context/character-context";
import { getShopInventory, type ShopItem } from "@/lib/game/shop";
import RoomShell from "../room-shell";

interface ShopProps {
  onContinue: () => void | Promise<void>;
  isAdvancing?: boolean;
}

async function readError(response: Response) {
  const data = await response.json().catch(() => null);
  return data?.message || "Failed to purchase item";
}

export default function Shop({ onContinue, isAdvancing = false }: ShopProps) {
  const { character, fetchCharacter } = useCharacter();
  const [purchasingItemId, setPurchasingItemId] = useState<string | null>(null);

  const shopItems = useMemo(
    () => getShopInventory(character?.floor || 1),
    [character?.floor]
  );

  if (!character) return null;

  const handlePurchase = async (item: ShopItem) => {
    if (purchasingItemId || character.gold < item.price) return;

    setPurchasingItemId(item.id);

    try {
      const response = await fetch("/api/character/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: character.id, itemId: item.id }),
      });

      if (!response.ok) throw new Error(await readError(response));

      await fetchCharacter(character.id);
      toast.success(`${item.name} equipped`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Purchase failed");
    } finally {
      setPurchasingItemId(null);
    }
  };

  return (
    <RoomShell
      icon={<ShoppingBag className="h-7 w-7" aria-hidden="true" />}
      eyebrow="Merchant room"
      title="The Gilded Lantern"
      description="Spend run gold on one reliable upgrade. A purchase replaces the item currently equipped in the same slot."
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-950">Available gold</p>
            <p className="mt-1 text-sm text-amber-800">
              Inventory strength scales with the current floor and stays stable while you shop.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-amber-200/70 px-4 py-2 font-bold text-amber-950 tabular-nums">
            <Coins className="h-5 w-5" aria-hidden="true" />
            {character.gold}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {shopItems.map((item) => {
            const equippedItem = character.equipment.find(
              (equipment) => equipment.slot === item.slot
            );
            const isEquipped = equippedItem?.name === item.name;
            const canAfford = character.gold >= item.price;
            const isPurchasing = purchasingItemId === item.id;

            return (
              <article
                key={item.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold tracking-wide text-slate-600 uppercase">
                        {item.slot}
                      </span>
                      <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-bold tracking-wide text-violet-700 uppercase">
                        {item.tier}
                      </span>
                    </div>
                    <h2 className="mt-3 font-medievalsharp text-2xl text-slate-950">
                      {item.name}
                    </h2>
                  </div>
                  <div className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-900 tabular-nums">
                    {item.price} gold
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.stats.attack !== undefined && (
                    <StatPill icon={Sword} label={`Attack +${item.stats.attack}`} />
                  )}
                  {item.stats.defense !== undefined && (
                    <StatPill
                      icon={ShieldCheck}
                      label={`Defense +${item.stats.defense}`}
                    />
                  )}
                  {item.stats.health !== undefined && (
                    <StatPill icon={Heart} label={`Health +${item.stats.health}`} />
                  )}
                </div>

                <div className="mt-4 min-h-10 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  {equippedItem ? (
                    <>
                      Replaces <span className="font-semibold">{equippedItem.name}</span>
                    </>
                  ) : (
                    "This equipment slot is currently empty."
                  )}
                </div>

                <Button
                  className="mt-4"
                  fullWidth
                  onClick={() => handlePurchase(item)}
                  disabled={!canAfford || isEquipped || purchasingItemId !== null}
                  isLoading={isPurchasing}
                  loadingLabel="Equipping..."
                  variant={canAfford && !isEquipped ? "primary" : "secondary"}
                >
                  {isEquipped
                    ? "Currently equipped"
                    : canAfford
                      ? "Purchase and equip"
                      : "Not enough gold"}
                </Button>
              </article>
            );
          })}
        </div>

        <div className="flex justify-end border-t border-slate-200 pt-5">
          <Button
            onClick={onContinue}
            isLoading={isAdvancing}
            loadingLabel="Opening the path..."
            size="lg"
            className="w-full sm:w-auto"
          >
            Leave the merchant
          </Button>
        </div>
      </div>
    </RoomShell>
  );
}

function StatPill({
  icon: Icon,
  label,
}: {
  icon: typeof Sword;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
