import type { Character } from "@/types/character";
import { GameManager, type GameState } from "@/lib/game/game-state";
import { EnemyManager, type Enemy } from "@/lib/game/enemy";
import { useEffect, useState } from "react";
import { CombatManager } from "@/lib/game/combat-manager";
import { calculateCombatRewards } from "@/lib/game/rewards";
import { RoomType } from "@/lib/game/room-manager";
import { REVIVE_COST } from "@/lib/game/revival";
import GameModal from "../end-battle-modal";
import RoomSelectionModal from "../room-selection-modal";
import CharacterStats from "../character-stats";
import { useCharacter } from "@/context/character-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Card from "../card";
import { Skull } from "lucide-react";

interface CombatProps {
  onExit: () => void;
}

function createGameState(character: Character, floor = character.floor) {
  return new GameManager({
    ...character,
    floor,
    equipment: character.equipment || [],
    powers: character.powers || [],
    block: 0,
    deck: [],
    hand: [],
    discardPile: [],
  }).getState();
}

export default function Combat({ onExit }: CombatProps) {
  const { character, updateCharacter, markCharacterAsDead, reviveCharacter } =
    useCharacter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [combatManager, setCombatManager] = useState<CombatManager | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);
  const [rewards, setRewards] = useState({
    gold: 0,
    experience: 0,
    floor: 1,
  });
  const [userCrystals, setUserCrystals] = useState(0);
  const [showRoomSelection, setShowRoomSelection] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<RoomType[]>([]);
  const router = useRouter();

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

    const initialGameState = createGameState(character);
    const enemy = EnemyManager.createEnemy(initialGameState.floor);
    const combat = new CombatManager(initialGameState, [enemy]);

    setGameState(initialGameState);
    setEnemies([enemy]);
    setCombatManager(combat);
  }, [character?.id]);

  if (!character) return null;

  const handleVictory = async (
    resolvedGameState: GameState,
    defeatedEnemies: Enemy[]
  ) => {
    try {
      const combatRewards = calculateCombatRewards(
        defeatedEnemies,
        resolvedGameState.floor
      );

      const updatedCharacter = await updateCharacter(character.id, {
        gold: character.gold + combatRewards.gold,
        experience: character.experience + combatRewards.experience,
        currentHealth: Math.max(1, resolvedGameState.character.currentHealth),
        monstersSlain:
          (character.monstersSlain || 0) + combatRewards.monstersSlain,
        floor: resolvedGameState.floor,
      });

      if (!updatedCharacter) {
        throw new Error("Failed to update character stats");
      }

      setRewards({
        gold: combatRewards.gold,
        experience: combatRewards.experience,
        floor: resolvedGameState.floor,
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

  const initializeBattle = (nextGameState: GameState) => {
    const enemy = EnemyManager.createEnemy(nextGameState.floor);
    const combat = new CombatManager(nextGameState, [enemy]);

    setGameState(nextGameState);
    setEnemies([enemy]);
    setCombatManager(combat);
  };

  const handleRevive = async () => {
    try {
      const result = await reviveCharacter(character.id);
      setUserCrystals(result.crystalsRemaining);
      initializeBattle(createGameState(result.character));
      setShowDefeat(false);
    } catch (error) {
      console.error("Failed to revive character:", error);
    }
  };

  const handleNextFloor = async () => {
    if (!gameState) return;

    const nextFloor = gameState.floor + 1;

    try {
      await updateCharacter(character.id, { floor: nextFloor });

      if (nextFloor % 5 === 0) {
        router.push(`/dashboard/game/${character.id}/rest`);
        return;
      }

      const possibleRooms = [
        RoomType.BATTLE,
        RoomType.REST,
        RoomType.SHOP,
        RoomType.EVENT,
      ];
      const selectedRooms = [...possibleRooms]
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      setAvailableRooms(selectedRooms);
      setShowRoomSelection(true);
    } catch (error) {
      console.error("Failed to update floor:", error);
      toast.error("Failed to proceed to next floor");
    }
  };

  const handleRoomSelection = (selectedRoom: RoomType) => {
    setShowRoomSelection(false);

    if (selectedRoom === RoomType.REST) {
      router.push(`/dashboard/game/${character.id}/rest`);
      return;
    }

    if (selectedRoom === RoomType.SHOP) {
      router.push(`/dashboard/game/${character.id}/shop`);
      return;
    }

    if (selectedRoom === RoomType.EVENT) {
      router.push(`/dashboard/game/${character.id}/event`);
      return;
    }

    const nextFloor = (gameState?.floor || character.floor || 1) + 1;
    const nextGameState = createGameState(character, nextFloor);
    setShowVictory(false);
    initializeBattle(nextGameState);
  };

  const handleCardClick = async (index: number) => {
    if (!gameState || !combatManager) return;

    const card = gameState.hand[index];
    if (!card || card.energy > gameState.currentEnergy) return;

    if (!combatManager.playCard(index, 0)) return;

    const updatedGameState = combatManager.getState();
    const updatedCombatState = combatManager.getCombatState();

    setGameState(updatedGameState);
    setEnemies(updatedCombatState.enemies);

    if (updatedGameState.status === "VICTORY") {
      await handleVictory(
        updatedGameState,
        updatedCombatState.defeatedEnemies
      );
    }
  };

  const handleEndTurn = async () => {
    if (!combatManager || !combatManager.endTurn()) return;

    const updatedGameState = combatManager.getState();
    const updatedCombatState = combatManager.getCombatState();

    setGameState(updatedGameState);
    setEnemies(updatedCombatState.enemies);

    if (updatedGameState.status === "DEFEAT") {
      await handleCombatDefeat();
    }
  };

  const getHealthBarColor = (percentage: number) => {
    if (percentage > 66) return "bg-gradient-to-r from-red-600 to-red-500";
    if (percentage > 33) {
      return "bg-gradient-to-r from-yellow-600 to-yellow-500";
    }
    return "bg-gradient-to-r from-red-800 to-red-700";
  };

  if (!gameState || !combatManager) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-2 md:px-4">
        <div className="relative min-h-[calc(100vh-4rem)] w-full pb-[280px] md:h-[calc(100vh-12rem)] md:pb-32">
          <div className="mb-[100px] flex flex-wrap justify-center gap-4 p-4 md:p-8">
            {enemies.map((enemy) => (
              <div
                key={enemy.id}
                className="relative w-full max-w-xs overflow-hidden rounded-xl border border-gray-700 bg-gradient-to-b from-gray-500 to-gray-700 p-2 pb-4 shadow-lg"
              >
                <div className="mb-2 flex items-center justify-between text-lg font-bold text-white md:text-xl">
                  <span>{enemy.name}</span>
                  <span className="rounded-full bg-gray-700/50 p-1.5">
                    <Skull className="h-5 w-5 text-red-400" />
                  </span>
                </div>

                <div className="pt-4 pb-2">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-white">HP</span>
                    <span className="text-sm font-medium text-white">
                      {enemy.currentHealth}/{enemy.maxHealth}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-700/60">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${getHealthBarColor(
                        (enemy.currentHealth / enemy.maxHealth) * 100
                      )}`}
                      style={{
                        width: `${(enemy.currentHealth / enemy.maxHealth) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="fixed right-0 bottom-0 left-0 z-10">
            <div className="mb-2 px-2 md:px-4">
              <CharacterStats gameState={gameState} />
            </div>

            <div className="h-36 bg-gradient-to-t from-gray-900/20 to-transparent md:h-48">
              <div className="hide-scrollbar h-full overflow-x-auto p-2 pb-2 md:p-4">
                <div className="flex h-full min-w-min justify-start gap-2 md:justify-center md:gap-3">
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

              <div className="absolute right-0 bottom-2 left-0 flex justify-between px-2 md:bottom-4 md:px-4">
                <button
                  onClick={onExit}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white transition-colors duration-200 hover:bg-red-700 md:px-4 md:py-2 md:text-base"
                >
                  Exit Game
                </button>

                <button
                  onClick={handleEndTurn}
                  className="bg-primary hover:bg-primary-dark rounded-lg px-4 py-2 font-medievalsharp text-base text-white shadow-lg transition-all duration-200 hover:shadow-xl md:px-6 md:py-3 md:text-lg"
                >
                  End Turn
                </button>
              </div>
            </div>
          </div>

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
            onClose={() => setShowVictory(false)}
            type="victory"
            rewards={rewards}
            onNextFloor={handleNextFloor}
          />
          <GameModal
            isOpen={showDefeat}
            onClose={() => setShowDefeat(false)}
            type="defeat"
            onRevive={handleRevive}
            crystalCost={REVIVE_COST}
            userCrystals={userCrystals}
          />
          <RoomSelectionModal
            isOpen={showRoomSelection}
            onClose={() => setShowRoomSelection(false)}
            onSelectRoom={handleRoomSelection}
            availableRooms={availableRooms}
            currentFloor={gameState.floor}
          />
        </div>
      </div>
    </div>
  );
}
