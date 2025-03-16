import { useState, useEffect } from "react";
import { useCharacter } from "@/context/character-context";
import { Equipment } from "@/types/character";
import { EquipmentSlot, ItemTier } from "@prisma/client";

interface NFT {
  id: string;
  name: string;
  description: string;
  slot: EquipmentSlot;
  tier: ItemTier;
  stats: {
    attack?: number;
    defense?: number;
    health?: number;
  };
}

interface EquipmentCardProps {
  item: Equipment | NFT;
  isEquipped?: boolean;
  onEquip?: () => void;
}

function EquipmentCard({ item, isEquipped, onEquip }: EquipmentCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h4 className="font-medium">{item.name}</h4>
      <p className="text-sm text-gray-600">{item.description}</p>
      <div className="mt-2">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
          {item.slot}
        </span>
      </div>
      {!isEquipped && onEquip && (
        <button
          onClick={onEquip}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Equip
        </button>
      )}
    </div>
  );
}

export default function EquipmentManager() {
  const { character, updateCharacter } = useCharacter();
  const [availableNFTs, setAvailableNFTs] = useState<NFT[]>([]);

  const handleEquip = async (nft: NFT) => {
    if (!character) return;

    try {
      const response = await fetch("/api/character/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: character.id,
          equipment: {
            name: nft.name,
            description: nft.description,
            slot: nft.slot,
            tier: nft.tier,
            stats: nft.stats,
            nftId: nft.id,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to equip item");

      // Update character state
      const updatedCharacter = await response.json();
      updateCharacter(updatedCharacter.id);
    } catch (error) {
      console.error("Equipment error:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-medievalsharp mb-4">Equipment</h2>

      {/* Currently Equipped */}
      <div className="mb-6">
        <h3 className="text-lg mb-2">Equipped Items</h3>
        <div className="grid grid-cols-3 gap-4">
          {character?.equipment?.map((item) => (
            <EquipmentCard key={item.id} item={item} isEquipped={true} />
          ))}
        </div>
      </div>

      {/* Available NFTs */}
      <div>
        <h3 className="text-lg mb-2">Available Items</h3>
        <div className="grid grid-cols-3 gap-4">
          {availableNFTs.map((nft) => (
            <EquipmentCard
              key={nft.id}
              item={nft}
              onEquip={() => handleEquip(nft)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
