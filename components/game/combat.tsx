import { Character } from "@/types/character";
import { GameState, GameManager } from "@/lib/game/game-state";
import { Enemy, EnemyManager } from "@/lib/game/enemy";
import { useState, useEffect } from "react";
import { CombatManager } from "@/lib/game/combat-manager";
import GameModal from "./end-battle-modal";
import CharacterStats from "./character-stats";
import { useCharacter } from "@/context/character-context";
import { toast } from "sonner";

interface CombatProps {
  onCombatEnd: () => void;
}

export default function Combat({ onCombatEnd }: CombatProps) {
  const {
    character,
    updateCharacterStats,
    markCharacterAsDead,
    reviveCharacter,
    updateCharacter,
  } = useCharacter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [combatManager, setCombatManager] = useState<CombatManager | null>(
    null
  );
  const [showVictory, setShowVictory] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);
  const [rewards, setRewards] = useState<{
    gold: number;
    experience: number;
    floor: number;
  }>({ gold: 0, experience: 0, floor: 1 });
  const [userCrystals, setUserCrystals] = useState(0);
  const [defeatedEnemies, setDefeatedEnemies] = useState<Enemy[]>([]);

  useEffect(() => {
    const fetchUserCrystals = async () => {
      try {
        const response = await fetch("/api/user/crystals");
        const data = await response.json();
        setUserCrystals(data.crystals);
      } catch (error) {
        console.error("Failed to fetch user crystals:", error);
      }
    };
    fetchUserCrystals();
  }, []);

  useEffect(() => {
    if (!character) return;

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

  useEffect(() => {
    if (gameState?.status === "VICTORY") {
      setDefeatedEnemies((prev) => [...prev, ...enemies]);
    }
  }, [gameState?.status, enemies]);

  if (!character) return null;

  const handleVictory = async () => {
    if (!character || !gameState) return;

    try {
      // Calculate rewards with fixed base values
      const goldReward = Math.floor(Math.random() * 10) + 5;

      // Calculate experience reward based on enemy type and floor level
      let expReward = 0;
      defeatedEnemies.forEach((enemy) => {
        const floorMultiplier = Math.max(1, Math.floor(gameState.floor / 5));
        if (enemy.isBoss) {
          expReward += 50 * floorMultiplier;
        } else if (enemy.isElite) {
          expReward += 25 * floorMultiplier;
        } else {
          expReward += 10 * floorMultiplier;
        }
      });

      // Ensure minimum experience reward
      expReward = Math.max(10, expReward);

      // Calculate new values
      const newGold = character.gold + goldReward;
      const newExp = character.experience + expReward;

      console.log("Victory calculation:", {
        currentExp: character.experience,
        expReward,
        newTotalExp: newExp,
        floor: gameState.floor,
        defeatedEnemies: defeatedEnemies.map((e) => ({
          name: e.name,
          isBoss: e.isBoss,
          isElite: e.isElite,
        })),
      });

      // Update character stats with explicit typing
      const updatedCharacter = await updateCharacterStats(character.id, {
        gold: newGold,
        experience: newExp,
        currentHealth: gameState.character.currentHealth,
        monstersSlain: character.monstersSlain + defeatedEnemies.length,
      });

      if (!updatedCharacter) {
        throw new Error("Failed to update character stats");
      }

      // Clear defeated enemies for next combat
      setDefeatedEnemies([]);

      // Make sure the character context is updated with the new values
      if (updateCharacter) {
        await updateCharacter(character.id);
      }

      // Update the rewards display
      setRewards({
        gold: goldReward,
        experience: expReward,
        floor: gameState.floor,
      });

      setShowVictory(true);
    } catch (error) {
      console.error("Failed to update character:", error);
      toast.error("Failed to update character stats");
    }
  };

  const handleCombatDefeat = async () => {
    try {
      await markCharacterAsDead(character.id);
      setShowDefeat(true);
    } catch (error) {
      console.error("Failed to update character death status:", error);
    }
  };

  const handleRevive = async () => {
    try {
      await reviveCharacter(character.id);

      // Reset game state
      const enhancedCharacter = {
        ...character,
        currentHealth: character.maxHealth,
        isDead: false,
      };

      const gameManager = new GameManager(enhancedCharacter);
      const initialGameState = gameManager.getState();

      // Create a new enemy for the current floor
      const enemy = EnemyManager.createEnemy(initialGameState.floor);

      // Initialize combat manager
      const combat = new CombatManager(initialGameState, [enemy]);

      setGameState(initialGameState);
      setEnemies([enemy]);
      setCombatManager(combat);
      setShowDefeat(false);
    } catch (error) {
      console.error("Failed to revive character:", error);
    }
  };

  const handleNextFloor = () => {
    // Clear defeated enemies for next combat
    setDefeatedEnemies([]);

    // Initialize game state with enhanced character for next floor
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
    initialGameState.floor = (gameState?.floor || 1) + 1; // Increment floor

    // Create an enemy for the new floor
    const enemy = EnemyManager.createEnemy(initialGameState.floor);

    // Initialize combat manager
    const combat = new CombatManager(initialGameState, [enemy]);

    setGameState(initialGameState);
    setEnemies([enemy]);
    setCombatManager(combat);
    setShowVictory(false);
  };

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
      handleVictory();
    } else if (updatedGameState.status === "DEFEAT") {
      handleCombatDefeat();
    }
  };

  if (!gameState || !combatManager) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] md:h-[calc(100vh-12rem)] w-full pb-[280px] md:pb-32">
      {/* Enemy Area */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-4 md:p-8 mb-[100px]">
        {enemies.map((enemy, index) => (
          <div
            key={enemy.id}
            className="bg-white p-3 md:p-6 rounded-xl shadow-lg border border-gray-200 w-full md:w-auto max-w-[280px]"
          >
            <div className="text-lg md:text-xl font-bold mb-2">
              {enemy.name}
            </div>
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
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width: `${
                        (enemy.currentHealth / enemy.maxHealth) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom UI Container */}
      <div className="fixed bottom-0 left-0 right-0 z-10">
        {/* Character Stats Panel */}
        <div className="px-2 md:px-4 mb-2">
          <CharacterStats gameState={gameState} />
        </div>

        {/* Hand Area */}
        <div className="h-36 md:h-48 bg-gradient-to-t from-gray-900/20 to-transparent">
          <div className="p-2 md:p-4 overflow-x-auto pb-2 hide-scrollbar h-full">
            <div className="flex gap-2 md:gap-3 min-w-min justify-start md:justify-center h-full">
              {gameState.hand.map((card, index) => (
                <div
                  key={`${card.id}-${index}`}
                  onClick={() => handleCardClick(index)}
                  className={`flex-shrink-0 bg-white p-2 md:p-4 rounded-lg shadow-md border border-gray-200 
                    w-24 md:w-32 h-full cursor-pointer 
                    transform transition-all duration-200 hover:-translate-y-2
                    ${
                      card.energy > gameState.currentEnergy
                        ? "opacity-50"
                        : "hover:shadow-xl"
                    }`}
                >
                  <div className="text-xs md:text-sm font-bold mb-1">
                    {card.name}
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-600">
                    {card.description}
                  </div>
                  <div
                    className={`text-[10px] md:text-xs mt-1 ${
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

          {/* End Turn Button - Moved inside hand area */}
          <div className="absolute right-2 md:right-4 bottom-2 md:bottom-4">
            <button
              onClick={handleEndTurn}
              className="px-4 md:px-6 py-2 md:py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medievalsharp text-base md:text-lg shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              End Turn
            </button>
          </div>
        </div>
      </div>

      {/* Add this CSS to your global styles */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <GameModal
        isOpen={showVictory}
        onClose={() => {
          setShowVictory(false);
          onCombatEnd();
        }}
        type="victory"
        rewards={{
          gold: rewards.gold,
          experience: rewards.experience,
          floor: gameState?.floor || 1,
        }}
        onNextFloor={handleNextFloor}
      />
      <GameModal
        isOpen={showDefeat}
        onClose={() => {
          setShowDefeat(false);
          onCombatEnd();
        }}
        type="defeat"
        onRevive={handleRevive}
        crystalCost={100}
        userCrystals={userCrystals}
      />
    </div>
  );
}
