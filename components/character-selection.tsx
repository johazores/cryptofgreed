import type { Character } from "@/types/character";
import { REVIVE_COST } from "@/lib/game/revival";
import { useRouter } from "next/navigation";
import { LuSwords } from "react-icons/lu";
import { GiCrossbow } from "react-icons/gi";
import { FaWandMagicSparkles } from "react-icons/fa6";

interface CharacterSelectionProps {
  character: Character;
  onRevive: (characterId: string) => void | Promise<void>;
  crystals: number;
}

export default function CharacterSelection({
  character,
  onRevive,
  crystals,
}: CharacterSelectionProps) {
  const router = useRouter();

  const getClassIcon = (characterClass: string) => {
    switch (characterClass) {
      case "MELEE":
        return <LuSwords className="h-6 w-6" />;
      case "RANGE":
        return <GiCrossbow className="h-6 w-6" />;
      case "MAGIC":
        return <FaWandMagicSparkles className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const healthPercentage =
    (character.currentHealth / character.maxHealth) * 100;
  const currentLevelExp = character.experience % 100;
  const expPercentage = currentLevelExp;
  const canRevive = crystals >= REVIVE_COST;

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl ${
        character.isDead
          ? "border-2 border-red-500"
          : "border border-gray-200"
      }`}
    >
      {character.isDead && (
        <div className="absolute top-0 right-0 left-0 bg-red-500 py-1 text-center text-xs text-white">
          FALLEN
        </div>
      )}

      <div className="p-6">
        <div className="my-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-lg p-3 ${
                character.isDead
                  ? "bg-red-100 text-red-500"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {getClassIcon(character.class)}
            </div>
            <div>
              <h3 className="font-medievalsharp text-xl text-gray-900">
                {character.name}
              </h3>
              <p className="text-sm text-gray-500">
                {character.class} • Level {character.level}
              </p>
            </div>
          </div>
          <span className="text-sm font-medium text-yellow-600">
            {character.gold} Gold
          </span>
        </div>

        <div className="mb-6 space-y-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Health</span>
              <span className="text-sm text-gray-600">
                {character.currentHealth}/{character.maxHealth}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  healthPercentage > 60
                    ? "bg-green-500"
                    : healthPercentage > 30
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${healthPercentage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Experience
              </span>
              <span className="text-sm text-gray-600">
                {currentLevelExp}/100
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${expPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <span className="text-sm text-gray-700">Monsters Slain</span>
            <span className="font-medievalsharp text-lg text-gray-900">
              {character.monstersSlain}
            </span>
          </div>
        </div>

        {character.isDead ? (
          <button
            onClick={() => onRevive(character.id)}
            disabled={!canRevive}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-medievalsharp text-white transition-colors duration-200 ${
              canRevive
                ? "bg-red-500 hover:bg-red-600"
                : "cursor-not-allowed bg-gray-300"
            }`}
          >
            Revive ({REVIVE_COST} Crystals)
          </button>
        ) : (
          <button
            onClick={() => router.push(`/dashboard/game/${character.id}`)}
            className="bg-primary hover:bg-primary-dark w-full rounded-lg px-6 py-3 font-medievalsharp text-white transition-colors duration-200"
          >
            Enter the Crypt
          </button>
        )}
      </div>
    </div>
  );
}
