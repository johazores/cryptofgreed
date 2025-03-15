import React from "react";
import { GameState } from "@/lib/game/game-state";
import { useCharacter } from "@/context/character-context";
import { Character } from "@/types/character";

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

  if (!character) return null;

  const currentHealth =
    gameState?.character.currentHealth ?? character.currentHealth;
  const healthPercentage = (currentHealth / character.maxHealth) * 100;
  const experiencePercentage = character.experience % 100;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center p-3 gap-4">
        {/* Character Info */}
        <div className="flex-shrink-0 border-r border-gray-200 pr-4">
          <div className="flex items-center gap-2">
            <h3 className="font-medievalsharp text-lg text-gray-800">
              {character.name}
            </h3>
            <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
              Lvl {character.level}
            </span>
          </div>
          <div className="text-xs text-gray-600 mt-1">{character.class}</div>
        </div>

        {/* Main Stats */}
        <div className="flex-grow space-y-2 min-w-[200px]">
          {/* Health */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Health</span>
              <span className="text-gray-900">
                {currentHealth}/{character.maxHealth}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-300"
                style={{ width: `${healthPercentage}%` }}
              />
            </div>
          </div>

          {/* Experience */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">EXP</span>
              <span className="text-gray-900">{character.experience}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${experiencePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Combat Stats */}
        {gameState && (
          <div className="flex gap-3 flex-shrink-0 border-l border-gray-200 pl-4">
            <div className="bg-blue-50 px-3 py-2 rounded">
              <div className="text-xs text-blue-700">Block</div>
              <div className="text-sm text-blue-900 font-bold">
                {gameState.block}
              </div>
            </div>
            <div className="bg-amber-50 px-3 py-2 rounded">
              <div className="text-xs text-amber-700">Energy</div>
              <div className="text-sm text-amber-900 font-bold">
                {gameState.currentEnergy}/{gameState.maxEnergy}
              </div>
            </div>
          </div>
        )}

        {/* Additional Stats */}
        <div className="flex gap-3 flex-shrink-0 border-l border-gray-200 pl-4">
          <div className="bg-yellow-50 px-3 py-2 rounded">
            <div className="text-xs text-yellow-700">Gold</div>
            <div className="text-sm text-yellow-900 font-bold">
              {character.gold}
            </div>
          </div>
          <div className="bg-purple-50 px-3 py-2 rounded">
            <div className="text-xs text-purple-700">Kills</div>
            <div className="text-sm text-purple-900 font-bold">
              {character.monstersSlain}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
