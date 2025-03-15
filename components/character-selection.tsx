import React from "react";
import { Character } from "@/types/character";
import { useRouter } from "next/navigation";

interface CharacterSelectionProps {
  character: Character;
  onRevive: (characterId: string) => void;
  crystals: number;
}

const CharacterSelection = ({
  character,
  onRevive,
  crystals,
}: CharacterSelectionProps) => {
  const router = useRouter();

  const getClassIcon = (characterClass: string) => {
    switch (characterClass) {
      case "MELEE":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      case "RANGE":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case "MAGIC":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const healthPercentage =
    (character.currentHealth / character.maxHealth) * 100;
  const expToNextLevel = 100; // Assuming 100 exp per level
  const currentLevelExp = character.experience % expToNextLevel;
  const expPercentage = (currentLevelExp / expToNextLevel) * 100;

  return (
    <div
      className={`
        relative bg-white rounded-xl shadow-lg overflow-hidden
        ${
          character.isDead
            ? "border-2 border-red-500"
            : "border border-gray-200"
        }
        transform transition-all duration-300 hover:scale-102 hover:shadow-xl
      `}
    >
      {character.isDead && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-xs py-1 text-center">
          FALLEN
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`
              p-3 rounded-lg
              ${
                character.isDead
                  ? "bg-red-100 text-red-500"
                  : "bg-primary/10 text-primary"
              }
            `}
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
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span className="text-sm font-medium">{character.gold}</span>
          </div>
        </div>

        {/* Updated Stats Section */}
        <div className="space-y-6 mb-6">
          {/* Health Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Health</span>
              <span className="text-sm text-gray-600">
                {character.currentHealth}/{character.maxHealth}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
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

          {/* Experience Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Experience
              </span>
              <span className="text-sm text-gray-600">
                {currentLevelExp}/{expToNextLevel}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${expPercentage}%` }}
              />
            </div>
          </div>

          {/* Kills Counter */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <span className="text-sm text-gray-700">Monsters Slain</span>
            <span className="text-lg font-medievalsharp text-gray-900">
              {character.monstersSlain}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {character.isDead ? (
          <button
            onClick={() => onRevive(character.id)}
            disabled={crystals < 100}
            className={`
              w-full py-3 px-6 rounded-lg font-medievalsharp
              flex items-center justify-center gap-2
              ${
                crystals < 100
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              } text-white transition-colors duration-200
            `}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Revive (100 Crystals)
          </button>
        ) : (
          <button
            onClick={() => router.push(`/dashboard/game/${character.id}`)}
            className="w-full py-3 px-6 rounded-lg font-medievalsharp bg-primary hover:bg-primary-dark text-white transition-colors duration-200"
          >
            Enter the Crypt
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterSelection;
