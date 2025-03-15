"use client";
import { useCharacter } from "@/context/character-context";
import { useRouter } from "next/navigation";
import { handleContinueToNextRoom } from "@/lib/game/room-navigation";
import CharacterStats from "./character-stats";

export default function RestSite() {
  const { character, updateCharacter } = useCharacter();
  const router = useRouter();

  const handleRest = async () => {
    if (!character) return;

    const healAmount = Math.floor(character.maxHealth * 0.3);
    const newHealth = Math.min(
      character.maxHealth,
      character.currentHealth + healAmount
    );

    try {
      await updateCharacter(character.id, {
        currentHealth: newHealth,
      });

      handleContinueToNextRoom(character, router);
    } catch (error) {
      console.error("Failed to rest:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-medievalsharp mb-4">Rest Site</h2>
      <div className="mb-6">
        {character && <CharacterStats character={character} />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-xl font-medievalsharp mb-2">Rest</h3>
          <p className="text-gray-600 mb-4">
            Heal {character ? Math.floor(character.maxHealth * 0.3) : 0} HP (30%
            of max HP)
          </p>
          <button
            onClick={handleRest}
            className="w-full p-4 bg-primary hover:bg-primary-dark text-white rounded-lg"
          >
            Rest and Continue
          </button>
        </div>
      </div>
    </div>
  );
}
