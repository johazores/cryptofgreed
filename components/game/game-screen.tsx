import { Character } from "@/types/character";
import Combat from "./combat";
import { useState } from "react";

interface GameScreenProps {
  character: Character;
  onExit: () => void;
}

export default function GameScreen({
  character: initialCharacter,
  onExit,
}: GameScreenProps) {
  const [character, setCharacter] = useState<Character>(initialCharacter);

  const handleCharacterUpdate = (updatedCharacter: Character) => {
    setCharacter(updatedCharacter);
  };

  const handleCombatEnd = () => {
    // Refresh the character data when combat ends
    fetch(`/api/characters/${character.id}`)
      .then((response) => response.json())
      .then((data) => {
        setCharacter({
          ...data,
          equipment: character.equipment || [],
          powers: character.powers || [],
          block: 0,
          deck: [],
          hand: [],
          discardPile: [],
        });
      })
      .catch((error) =>
        console.error("Failed to refresh character data:", error)
      );
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex justify-end mb-4">
          <button
            onClick={onExit}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded"
          >
            Exit Game
          </button>
        </div>

        <Combat
          character={character}
          onCombatEnd={handleCombatEnd}
          onCharacterUpdate={handleCharacterUpdate}
        />
      </div>
    </div>
  );
}
