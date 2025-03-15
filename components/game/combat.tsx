import { Character } from "@/types/character";
import { GameState, GameManager } from "@/lib/game/game-state";
import { Enemy, EnemyManager } from "@/lib/game/enemy";
import { useState, useEffect } from "react";
import { CombatManager } from "@/lib/game/combat-manager";
import GameModal from "./modal";

interface CombatProps {
  character: Character;
  onCombatEnd: () => void;
}

export default function Combat({ character, onCombatEnd }: CombatProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [combatManager, setCombatManager] = useState<CombatManager | null>(
    null
  );
  const [showVictory, setShowVictory] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);
  const [rewards, setRewards] = useState({ gold: 0, experience: 0 });

  const handleCombatVictory = async () => {
    // Calculate rewards based on floor level and enemies defeated
    const goldReward = Math.floor(
      50 * (gameState?.floor || 1) * (1 + Math.random() * 0.5)
    );
    const expReward = Math.floor(
      25 * (gameState?.floor || 1) * (1 + Math.random() * 0.5)
    );

    setRewards({
      gold: goldReward,
      experience: expReward,
    });

    try {
      const response = await fetch("/api/characters/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterId: character.id,
          updates: {
            gold: character.gold + goldReward,
            experience: character.experience + expReward,
            currentHealth: gameState?.character.currentHealth,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update character stats");
      }

      setShowVictory(true);
    } catch (error) {
      console.error("Failed to update character:", error);
      // Handle error appropriately
    }
  };

  const handleCombatDefeat = async () => {
    try {
      const response = await fetch("/api/characters/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterId: character.id,
          updates: {
            isDead: true,
            currentHealth: 0,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update character death status");
      }

      setShowDefeat(true);
    } catch (error) {
      console.error("Failed to update character death status:", error);
    }
  };

  useEffect(() => {
    // Initialize game state with enhanced character
    const enhancedCharacter: Character = {
      ...character,
      equipment: character.equipment || [],
      powers: character.powers || [],
      block: 0,
      deck: [],
      hand: [],
      discardPile: [],
    };

    const gameManager = new GameManager(enhancedCharacter);
    const initialGameState = gameManager.getState();

    // Create an enemy for the current floor
    const enemy = EnemyManager.createEnemy(initialGameState.floor);

    // Initialize combat manager
    const combat = new CombatManager(initialGameState, [enemy]);

    setGameState(initialGameState);
    setEnemies([enemy]);
    setCombatManager(combat);
  }, [character]);

  const handleCardClick = (index: number) => {
    if (!gameState || !combatManager) return;

    const card = gameState.hand[index];
    if (card.energy > gameState.currentEnergy) return; // Can't play if not enough energy

    // For now, we'll assume single target cards always target the first enemy
    const targetIndex = 0;

    if (combatManager.playCard(index, targetIndex)) {
      setGameState({ ...combatManager.getState() });
      setEnemies([...combatManager.getCombatState().enemies]);
    }
  };

  const handleEndTurn = () => {
    if (!combatManager || !gameState) return;

    // Process enemy actions
    combatManager.processEnemyTurn();

    // Move all cards from hand to discard pile
    combatManager.endTurn();

    // Update both states
    const updatedGameState = combatManager.getState();
    setGameState({ ...updatedGameState });
    setEnemies([...combatManager.getCombatState().enemies]);

    // Check game status
    if (updatedGameState.status === "VICTORY") {
      handleCombatVictory();
    } else if (updatedGameState.status === "DEFEAT") {
      handleCombatDefeat();
    }
  };

  if (!gameState || !combatManager) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-[calc(100vh-12rem)] w-full">
      {/* Character Stats Panel */}
      <div className="fixed left-4 bottom-4 z-10">
        <div className="w-72 bg-white rounded-xl shadow-lg border border-gray-200">
          {/* Header */}
          <div className="bg-gray-50 p-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medievalsharp text-xl text-gray-800">
                {character.name}
              </h3>
              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                Floor {gameState.floor}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 space-y-4">
            {/* Health */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Health</span>
                <span className="text-gray-900 font-medium">
                  {gameState.character.currentHealth}/
                  {gameState.character.maxHealth}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-red-500 rounded-full transition-all"
                  style={{
                    width: `${
                      (gameState.character.currentHealth /
                        gameState.character.maxHealth) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Block & Energy */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <div className="text-sm text-blue-700">Block</div>
                <div className="text-blue-900 font-bold">{gameState.block}</div>
              </div>
              <div className="bg-amber-50 p-2 rounded-lg">
                <div className="text-sm text-amber-700">Energy</div>
                <div className="text-amber-900 font-bold">
                  {gameState.currentEnergy}/{gameState.maxEnergy}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enemy Area */}
      <div className="flex justify-center gap-4 p-8">
        {enemies.map((enemy, index) => (
          <div
            key={enemy.id}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <div className="text-xl font-bold mb-2">{enemy.name}</div>
            <div className="space-y-2">
              {/* Enemy Health */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>HP</span>
                  <span>
                    {enemy.currentHealth}/{enemy.maxHealth}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all"
                    style={{
                      width: `${
                        (enemy.currentHealth / enemy.maxHealth) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Enemy Block */}
              {enemy.block > 0 && (
                <div className="flex items-center gap-2 text-blue-600">
                  <span>Block: {enemy.block}</span>
                </div>
              )}

              {/* Enemy Intent */}
              <div className="mt-2 text-gray-600">
                {enemy.intent.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add End Turn Button */}
      <div className="fixed right-4 bottom-4 z-10">
        <button
          onClick={handleEndTurn}
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medievalsharp text-lg shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          End Turn
        </button>
      </div>

      {/* Hand Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex justify-center gap-3">
          {gameState.hand.map((card, index) => (
            <div
              key={`${card.id}-${index}`}
              onClick={() => handleCardClick(index)}
              className={`bg-white p-4 rounded-lg shadow-md border border-gray-200 w-32 cursor-pointer 
                transform transition-all duration-200 hover:-translate-y-2
                ${
                  card.energy > gameState.currentEnergy
                    ? "opacity-50"
                    : "hover:shadow-xl"
                }`}
            >
              <div className="text-sm font-bold mb-1">{card.name}</div>
              <div className="text-xs text-gray-600">{card.description}</div>
              <div
                className={`text-xs mt-1 ${
                  card.energy > gameState.currentEnergy
                    ? "text-red-600"
                    : "text-blue-600"
                }`}
              >
                Energy: {card.energy}
              </div>
            </div>
          ))}
        </div>
      </div>
      <GameModal
        isOpen={showVictory}
        onClose={() => {
          setShowVictory(false);
          onCombatEnd();
        }}
        type="victory"
        rewards={rewards}
      />
      <GameModal
        isOpen={showDefeat}
        onClose={() => {
          setShowDefeat(false);
          onCombatEnd();
        }}
        type="defeat"
      />
    </div>
  );
}
