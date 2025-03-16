"use client";
import { useCharacter } from "@/context/character-context";
import CharacterStats from "../character-stats";
import Button from "@/components/ui/button";
import { GiCampfire } from "react-icons/gi";

interface RestSiteProps {
  onContinue: () => void;
}

export default function RestSite({ onContinue }: RestSiteProps) {
  const { character, updateCharacter } = useCharacter();

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
      onContinue();
    } catch (error) {
      console.error("Failed to rest:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <GiCampfire className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-medievalsharp">Rest Site</h2>
        </div>

        <div className="mb-8">
          {character && <CharacterStats character={character} />}
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-medievalsharp mb-3">Rest Options</h3>
          <p className="text-gray-600 mb-4">
            Heal {character ? Math.floor(character.maxHealth * 0.3) : 0} HP
            <span className="text-sm text-gray-500"> (30% of max HP)</span>
          </p>
          <Button
            onClick={handleRest}
            fullWidth
            size="lg"
            className="font-medievalsharp"
          >
            Rest and Heal
          </Button>
        </div>

        <Button
          onClick={onContinue}
          variant="outline"
          fullWidth
          size="lg"
          className="font-medievalsharp"
        >
          Skip Rest
        </Button>
      </div>
    </div>
  );
}
