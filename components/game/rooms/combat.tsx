import { Character } from "@/types/character";
import { GameState, GameManager } from "@/lib/game/game-state";
import { Enemy, EnemyManager } from "@/lib/game/enemy";
import { useState, useEffect } from "react";
import { CombatManager } from "@/lib/game/combat-manager";
import GameModal from "../end-battle-modal";
import CharacterStats from "../character-stats";
import { useCharacter } from "@/context/character-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Card from "../card";
import { Skull } from "lucide-react";

interface CombatProps {
  onCombatEnd: () => void;
  onExit: () => void;
}

enum RoomType {
  BATTLE = "BATTLE",
  REST = "REST",
  SHOP = "SHOP",
  EVENT = "EVENT",
}

export default function Combat({ onCombatEnd, onExit }: CombatProps) {
  const { character, updateCharacter, markCharacterAsDead, reviveCharacter } = useCharacter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [combatManager, setCombatManager] = useState<CombatManager | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);
  const [rewards, setRewards] = useState<{
    gold: number;
    experience: number;
    floor: number;
  }>({ gold: 0, experience: 0, floor: 1 });
  const [userCrystals, setUserCrystals] = useState(0);
  const [defeatedEnemies, setDefeatedEnemies] = useState<Enemy[]>([]);
  const router = useRouter();
  const [showRoomSelection, setShowRoomSelection] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<RoomType[]>([]);

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
  }, [character?.id]); // Only re-run when character ID changes

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
      const currentMonstersSlain = character.monstersSlain || 0;
      const newMonstersSlain = currentMonstersSlain + enemies.length; // Use enemies.length instead of defeatedEnemies

      // Log the values for debugging
      console.log("Updating character stats:", {
        currentMonstersSlain,
        newMonstersSlain,
        enemiesDefeated: enemies.length,
      });

      // Update character stats
      const updatedCharacter = await updateCharacter(character.id, {
        gold: newGold,
        experience: newExp,
        currentHealth: Math.max(1, gameState.character.currentHealth),
        monstersSlain: newMonstersSlain,
        floor: gameState.floor, // Make sure to include the current floor
      });

      if (!updatedCharacter) {
        throw new Error("Failed to update character stats");
      }

      // Clear defeated enemies for next combat
      setDefeatedEnemies([]);

      // Update the rewards display
      setRewards({
        gold: goldReward,
        experience: expReward,
        floor: gameState.floor,
      });

      setShowVictory(true);
    } catch (error) {
      console.error("Failed to update character:", error);
      toast.error("Failed to update character stats. Please try again.");
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

  const handleNextFloor = async () => {
    if (!character || !gameState) return;

    // Clear defeated enemies for next combat
    setDefeatedEnemies([]);

    const nextFloor = (gameState.floor || 1) + 1;

    try {
      await updateCharacter(character.id, {
        floor: nextFloor,
      });

      // Special case: force rest site every 5 floors
      if (nextFloor % 5 === 0) {
        router.push(`/dashboard/game/${character.id}/rest`);
        return;
      }

      // Generate 2 random unique room options
      const possibleRooms = [RoomType.BATTLE, RoomType.REST, RoomType.SHOP, RoomType.EVENT];
      const numberOfChoices = 2; // Changed from 3 to 2
      const shuffledRooms = [...possibleRooms].sort(() => Math.random() - 0.5);
      const selectedRooms = shuffledRooms.slice(0, numberOfChoices);

      setAvailableRooms(selectedRooms);
      setShowRoomSelection(true);
    } catch (error) {
      console.error("Failed to update floor:", error);
      toast.error("Failed to proceed to next floor");
    }
  };

  const handleRoomSelection = (selectedRoom: RoomType) => {
    setShowRoomSelection(false);

    switch (selectedRoom) {
      case RoomType.REST:
        router.push(`/dashboard/game/${character.id}/rest`);
        break;
      case RoomType.SHOP:
        router.push(`/dashboard/game/${character.id}/shop`);
        break;
      case RoomType.EVENT:
        router.push(`/dashboard/game/${character.id}/event`);
        break;
      case RoomType.BATTLE:
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
        initialGameState.floor = (gameState?.floor || 1) + 1;

        setGameState(initialGameState);
        setShowVictory(false);
        initializeBattle(initialGameState);
        break;
    }
  };

  const initializeBattle = (gameState: GameState) => {
    // Create a new enemy for the current floor
    const enemy = EnemyManager.createEnemy(gameState.floor);

    // Initialize combat manager
    const combat = new CombatManager(gameState, [enemy]);

    setEnemies([enemy]);
    setCombatManager(combat);
  };

  const handleCardClick = (index: number) => {
    if (!gameState || !combatManager) return;

    const card = gameState.hand[index];
    if (card.energy > gameState.currentEnergy) return; // Can't play if not enough energy

    // For now, we'll assume single target cards always target the first enemy
    const targetIndex = 0;

    if (combatManager.playCard(index, targetIndex)) {
      const updatedGameState = { ...combatManager.getState() };
      const updatedEnemies = [...combatManager.getCombatState().enemies];
      
      setGameState(updatedGameState);
      setEnemies(updatedEnemies);

      // Check for victory condition after playing a card
      if (updatedEnemies.every(enemy => enemy.currentHealth <= 0)) {
        setDefeatedEnemies(updatedEnemies);
        handleVictory();
      }
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
    const updatedEnemies = [...combatManager.getCombatState().enemies];
    
    setGameState({ ...updatedGameState });
    setEnemies(updatedEnemies);

    // Check game status
    if (updatedGameState.status === "DEFEAT") {
      handleCombatDefeat();
    }
  };

  const getHealthBarColor = (percentage: number) => {
    if (percentage > 66) return "bg-gradient-to-r from-red-600 to-red-500";
    if (percentage > 33) return "bg-gradient-to-r from-yellow-600 to-yellow-500";
    return "bg-gradient-to-r from-red-800 to-red-700";
  };

  if (!gameState || !combatManager) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-2 md:px-4">
        <div className="relative min-h-[calc(100vh-4rem)] md:h-[calc(100vh-12rem)] w-full pb-[280px] md:pb-32">
          {/* Enemy Area */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-4 p-4 md:p-8 mb-[100px]">
            {enemies.map((enemy, index) => (
              <div
                key={enemy.id}
                className="relative w-full max-w-xs p-2 bg-gradient-to-b from-gray-500 to-gray-700 rounded-xl border border-gray-700 shadow-lg overflow-hidden pb-4"
              >
                <div className="flex justify-between items-center text-lg md:text-xl font-bold mb-2 text-white">
                  <span>{enemy.name}</span>
                  <span className="bg-gray-700/50 rounded-full p-1.5">
                    <Skull className="h-5 w-5 text-red-400" />
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="pt-4 pb-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium text-white">HP</span>
                      <span className="text-sm font-medium text-white">
                        {enemy.currentHealth}/{enemy.maxHealth}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-700/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${getHealthBarColor(
                          (enemy.currentHealth / enemy.maxHealth) * 100
                        )}`}
                        style={{
                          width: `${(enemy.currentHealth / enemy.maxHealth) * 100}%`,
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
                    <Card
                      key={`${card.id}-${index}`}
                      card={card}
                      index={index}
                      currentEnergy={gameState.currentEnergy}
                      onClick={handleCardClick}
                    />
                  ))}
                </div>
              </div>

              {/* Button Container */}
              <div className="absolute bottom-2 md:bottom-4 left-0 right-0 flex justify-between px-2 md:px-4">
                {/* Exit Button */}
                <button
                  onClick={onExit}
                  className="px-3 md:px-4 py-1.5 md:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm md:text-base transition-colors duration-200"
                >
                  Exit Game
                </button>

                {/* End Turn Button */}
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
      </div>
    </div>
  );
}
