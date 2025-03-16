import React, { useState } from "react";
import { GameState } from "@/lib/game/game-state";
import { useCharacter } from "@/context/character-context";
import { Character } from "@/types/character";
import EquipmentModal from "./equipment-modal";

interface CharacterStatsProps {
  gameState?: GameState;
  character?: Character;
}

export default function CharacterStats({
  gameState,
  character: propCharacter,
}: CharacterStatsProps) {
  const { character: contextCharacter } = useCharacter();
  const character = propCharacter || contextCharacter;
  const [showEquipment, setShowEquipment] = useState(false);

  if (!character) return null;

  const currentHealth =
    gameState?.character.currentHealth ?? character.currentHealth;
  const healthPercentage = (currentHealth / character.maxHealth) * 100;
  const experiencePercentage = character.experience % 100;
  return (
    <>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex flex-col md:flex-row items-start md:items-center p-2 md:p-3 gap-2 md:gap-4 text-sm md:text-base">
          {/* Character Info */}
          <div className="flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-200 pb-2 md:pb-0 md:pr-4 w-full md:w-auto">
            <div className="flex items-center gap-1 md:gap-2">
              <h3 className="font-medievalsharp text-base md:text-lg text-gray-800">
                {character.name}
              </h3>
              <span className="px-1.5 md:px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                Lvl {character.level}
              </span>
              <button
                onClick={() => setShowEquipment(true)}
                className="ml-1 md:ml-2 p-1 md:p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                title="View Equipment"
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </button>
            </div>
            <div className="text-xs text-gray-600">{character.class}</div>
          </div>

          {/* Main Stats */}
          <div className="flex-grow space-y-1 md:space-y-2 min-w-[150px] md:min-w-[200px] w-full md:w-auto">
            {/* Health */}
            <div>
              <div className="flex justify-between text-xs mb-0.5 md:mb-1">
                <span className="text-gray-600">Health</span>
                <span className="text-gray-900">
                  {currentHealth}/{character.maxHealth}
                </span>
              </div>
              <div className="h-1 md:h-1.5 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-300"
                  style={{ width: `${healthPercentage}%` }}
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <div className="flex justify-between text-xs mb-0.5 md:mb-1">
                <span className="text-gray-600">EXP</span>
                <span className="text-gray-900">{character.experience}</span>
              </div>
              <div className="h-1 md:h-1.5 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${experiencePercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Combat Stats */}
          {gameState && (
            <div className="flex gap-2 md:gap-3 flex-shrink-0 border-t md:border-t-0 md:border-l border-gray-200 pt-2 md:pt-0 md:pl-4 w-full md:w-auto">
              <div className="bg-blue-50 px-2 md:px-3 py-1 md:py-2 rounded flex-1 md:flex-auto">
                <div className="text-xs text-blue-700">Block</div>
                <div className="text-xs md:text-sm text-blue-900 font-bold">
                  {gameState.block}
                </div>
              </div>
              <div className="bg-amber-50 px-2 md:px-3 py-1 md:py-2 rounded flex-1 md:flex-auto">
                <div className="text-xs text-amber-700">Energy</div>
                <div className="text-xs md:text-sm text-amber-900 font-bold">
                  {gameState.currentEnergy}/{gameState.maxEnergy}
                </div>
              </div>
            </div>
          )}

          {/* Additional Stats */}
          <div className="flex gap-2 md:gap-3 flex-shrink-0 border-t md:border-t-0 md:border-l border-gray-200 pt-2 md:pt-0 md:pl-4 w-full md:w-auto">
            <div className="bg-yellow-50 px-2 md:px-3 py-1 md:py-2 rounded flex-1 md:flex-auto">
              <div className="text-xs text-yellow-700">Gold</div>
              <div className="text-xs md:text-sm text-yellow-900 font-bold">
                {character.gold}
              </div>
            </div>
            <div className="bg-purple-50 px-2 md:px-3 py-1 md:py-2 rounded flex-1 md:flex-auto">
              <div className="text-xs text-purple-700">Kills</div>
              <div className="text-xs md:text-sm text-purple-900 font-bold">
                {character.monstersSlain}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EquipmentModal
        isOpen={showEquipment}
        onClose={() => setShowEquipment(false)}
        character={character}
      />
    </>
  );
}
