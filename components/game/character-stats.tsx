import React, { useState } from "react";
import { GameState } from "@/lib/game/game-state";
import { useCharacter } from "@/context/character-context";
import { Character } from "@/types/character";
import EquipmentModal from "./equipment-modal";
import { Coins, Shield, Skull, Zap } from "lucide-react";

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

  const currentHealth = gameState?.character.currentHealth ?? character.currentHealth;
  const healthPercentage = (currentHealth / character.maxHealth) * 100;
  const experiencePercentage = character.experience % 100;
  return (
    <>
      <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
        <div className="col md:flex-row items-start md:items-center p-2 pt-3 md:p-3 gap-2 md:gap-4 text-sm md:text-base">
          {/* Character Info */}
          <div className="flex-shrink-0 pb-1 md:pb-1 md:pr-4 w-full md:w-auto border-b border-gray-700">
            <div className="flex items-center gap-1 md:gap-2">
              <h3 className="font-medievalsharp text-base md:text-lg text-white">
                {character.name}
              </h3>
              <span className="px-2 py-0.5 bg-yellow-900/50 border border-yellow-800/50 rounded text-xs font-medium text-yellow-400">
                Lvl {character.level}
              </span>
              <div className="flex items-center ml-auto">
                <button
                  onClick={() => setShowEquipment(true)}
                  className="p-1.5 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors"
                  title="View Equipment"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-400"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-300">{character.class}</div>
          </div>

          {/* Main Stats */}
          <div className="flex-grow space-y-1 md:space-y-2 min-w-[150px] md:min-w-[200px] w-full md:w-auto">
            {/* Health */}
            <div>
              <div className="flex justify-between text-xs mb-0.5 md:mb-1 pt-2">
                <span className="text-white">Health</span>
                <span className="text-white">
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
                <span className="text-white">EXP</span>
                <span className="text-white">{character.experience}</span>
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
            <div className="grid grid-cols-4 gap-0.5">
              <StatItem label="Block" value={gameState.block} color="blue" />
              <StatItem
                label="Energy"
                color="yellow"
                value={`${gameState.currentEnergy}/${gameState.maxEnergy}`}
              />
              <StatItem label="Gold" value={character.gold} color="gold" />
              <StatItem label="Kills" value={character.monstersSlain} color="purple" />
            </div>
          )}
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

interface StatItemProps {
  label: string;
  value: number | string;
  color: "blue" | "yellow" | "gold" | "purple" | "green" | "red";
}

const StatItem = ({ label, value, color }: StatItemProps) => {
  const colorClasses = {
    blue: "text-blue-400 bg-blue-900/20",
    yellow: "text-yellow-400 bg-yellow-900/20",
    gold: "text-yellow-500 bg-yellow-900/20",
    purple: "text-purple-400 bg-purple-900/20",
    green: "text-green-400 bg-green-900/20",
    red: "text-red-400 bg-red-900/20",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg p-2 ${colorClasses[color]}`}
    >
      <div className="text-xs text-white/80">{label}</div>
      <div className="text-sm font-medium text-white">{value}</div>
    </div>
  );
};
