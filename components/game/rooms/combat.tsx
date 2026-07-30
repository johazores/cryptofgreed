"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Shield, Skull, Swords, Zap } from "lucide-react";
import { toast } from "sonner";
import type { Character } from "@/types/character";
import { GameManager, type GameState } from "@/lib/game/game-state";
import { EnemyManager, type Enemy } from "@/lib/game/enemy";
import { CombatManager } from "@/lib/game/combat-manager";
import { calculateCombatRewards } from "@/lib/game/rewards";
import { REVIVE_COST } from "@/lib/game/revival";
import { useCharacter } from "@/context/character-context";
import Button from "@/components/ui/button";
import Card from "../card";
import CharacterStats from "../character-stats";
import GameModal from "../end-battle-modal";

interface CombatProps {
  onExit: () => void;
  onComplete: () => void | Promise<void>;
  isAdvancing?: boolean;
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

export default function Combat({
  onExit,
  onComplete,
  isAdvancing = false,
}: CombatProps) {
  const { character, updateCharacter, markCharacterAsDead, reviveCharacter } =
    useCharacter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [combatManager, setCombatManager] = useState<CombatManager | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isEndingTurn, setIsEndingTurn] = useState(false);
  const [rewards, setRewards] = useState({
    gold: 0,
    experience: 0,
    floor: 1,
  });
  const [userCrystals, setUserCrystals] = useState(0);

  useEffect(() => {
    const fetchUserCrystals = async () => {
      try {
        const response = await fetch("/api/user/crystals");
        if (!response.ok) return;
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
    setShowVictory(false);
    setShowDefeat(false);
    setIsResolving(false);
  }, [character?.id, character?.floor]);

  if (!character) return null;

  const handleVictory = async (
    resolvedGameState: GameState,
    defeatedEnemies: Enemy[]
  ) => {
    if (isResolving) return;
    setIsResolving(true);

    try {
      const combatRewards = calculateCombatRewards(
        defeatedEnemies,
        resolvedGameState.floor
      );

      await updateCharacter(character.id, {
        gold: character.gold + combatRewards.gold,
        experience: character.experience + combatRewards.experience,
        currentHealth: Math.max(1, resolvedGameState.character.currentHealth),
        monstersSlain:
          (character.monstersSlain || 0) + combatRewards.monstersSlain,
        floor: resolvedGameState.floor,
      });

      setRewards({
        gold: combatRewards.gold,
        experience: combatRewards.experience,
        floor: resolvedGameState.floor,
      });
      setShowVictory(true);
    } catch (error) {
      console.error("Failed to resolve victory:", error);
      toast.error("Rewards could not be saved. Please try again.");
      setIsResolving(false);
    }
  };

  const handleCombatDefeat = async () => {
    if (isResolving) return;
    setIsResolving(true);

    try {
      await markCharacterAsDead(character.id);
      setShowDefeat(true);
    } catch (error) {
      console.error("Failed to update character death status:", error);
      setIsResolving(false);
    }
  };

  const initializeBattle = (nextGameState: GameState) => {
    const enemy = EnemyManager.createEnemy(nextGameState.floor);
    const combat = new CombatManager(nextGameState, [enemy]);

    setGameState(nextGameState);
    setEnemies([enemy]);
    setCombatManager(combat);
    setIsResolving(false);
  };

  const handleRevive = async () => {
    const result = await reviveCharacter(character.id);
    setUserCrystals(result.crystalsRemaining);
    initializeBattle(createGameState(result.character));
    setShowDefeat(false);
  };

  const handleCardClick = async (index: number) => {
    if (!gameState || !combatManager || isResolving || isEndingTurn) return;

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
    if (!combatManager || isResolving || isEndingTurn) return;
    setIsEndingTurn(true);

    try {
      if (!combatManager.endTurn()) return;

      const updatedGameState = combatManager.getState();
      const updatedCombatState = combatManager.getCombatState();

      setGameState(updatedGameState);
      setEnemies(updatedCombatState.enemies);

      if (updatedGameState.status === "DEFEAT") {
        await handleCombatDefeat();
      }
    } finally {
      setIsEndingTurn(false);
    }
  };

  if (!gameState || !combatManager) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <Swords className="mx-auto h-9 w-9 animate-pulse text-amber-200" />
          <p className="mt-3 text-sm font-semibold tracking-widest text-slate-400 uppercase">
            Preparing combat
          </p>
        </div>
      </div>
    );
  }

  const enemy = enemies[0];
  const enemyHealthPercentage = enemy
    ? Math.max(0, Math.min(100, (enemy.currentHealth / enemy.maxHealth) * 100))
    : 0;
  const combatLocked =
    isResolving || isEndingTurn || isAdvancing || gameState.status !== "PLAYING";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-[radial-gradient(circle_at_top,#2a1820_0%,#101116_38%,#07080b_100%)] text-white">
      <header className="border-b border-white/10 bg-black/20 px-3 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onExit}
              disabled={combatLocked}
              className="text-slate-300 hover:bg-white/10 hover:text-white"
              aria-label="Exit combat and return to dashboard"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Exit run</span>
            </Button>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-amber-200/70 uppercase">
                Floor {gameState.floor} · Turn {combatManager.getCombatState().turn}
              </p>
              <h1 className="font-medievalsharp text-xl sm:text-2xl">
                Combat Chamber
              </h1>
            </div>
          </div>
          <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 sm:block">
            Read intent, then commit
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-3 py-6 sm:px-6 sm:py-10">
        {enemy ? (
          <article className="w-full max-w-xl overflow-hidden rounded-3xl border border-red-300/20 bg-gradient-to-b from-slate-800/95 to-slate-950/95 shadow-2xl">
            <div className="border-b border-white/10 p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.22em] text-red-300/70 uppercase">
                    {enemy.isBoss ? "Boss" : enemy.isElite ? "Elite" : "Enemy"}
                  </p>
                  <h2 className="mt-1 font-medievalsharp text-3xl sm:text-4xl">
                    {enemy.name}
                  </h2>
                </div>
                <div className="rounded-2xl border border-red-300/15 bg-red-400/10 p-3 text-red-300">
                  <Skull className="h-7 w-7" aria-hidden="true" />
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                  <span className="text-slate-300">Health</span>
                  <span className="tabular-nums">
                    {enemy.currentHealth}/{enemy.maxHealth}
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label={`${enemy.name} health`}
                  aria-valuemin={0}
                  aria-valuemax={enemy.maxHealth}
                  aria-valuenow={enemy.currentHealth}
                  className="h-3 overflow-hidden rounded-full bg-black/40"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-700 via-red-500 to-orange-400 transition-[width] duration-300"
                    style={{ width: `${enemyHealthPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7">
              <div className="rounded-2xl border border-red-300/15 bg-red-400/10 p-4">
                <div className="flex items-center gap-2 text-red-200">
                  <Swords className="h-5 w-5" aria-hidden="true" />
                  <span className="text-xs font-bold tracking-wider uppercase">
                    Intent
                  </span>
                </div>
                <p className="mt-3 font-semibold text-white">
                  {enemy.intent.description}
                </p>
                <p className="mt-1 text-sm text-red-100/70">
                  Plan block and damage before ending the turn.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-300/15 bg-sky-400/10 p-4">
                <div className="flex items-center gap-2 text-sky-200">
                  <Shield className="h-5 w-5" aria-hidden="true" />
                  <span className="text-xs font-bold tracking-wider uppercase">
                    Enemy block
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold tabular-nums text-white">
                  {enemy.block}
                </p>
                <p className="mt-1 text-sm text-sky-100/70">
                  Block is removed before health takes damage.
                </p>
              </div>
            </div>
          </article>
        ) : (
          <div className="text-center text-slate-300">Resolving encounter...</div>
        )}
      </main>

      <footer className="sticky bottom-0 z-20 border-t border-white/10 bg-slate-950/95 shadow-[0_-20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl space-y-3 px-3 py-3 sm:px-6 sm:py-4">
          <CharacterStats gameState={gameState} />

          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <div className="min-w-0 flex-1">
              <div className="hide-scrollbar overflow-x-auto pb-2">
                <div className="flex min-w-max gap-3 px-0.5 pt-2">
                  {gameState.hand.length > 0 ? (
                    gameState.hand.map((card, index) => (
                      <Card
                        key={`${card.id}-${index}`}
                        card={card}
                        index={index}
                        currentEnergy={gameState.currentEnergy}
                        onClick={handleCardClick}
                        disabled={combatLocked}
                      />
                    ))
                  ) : (
                    <div className="flex h-44 w-64 items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/5 text-sm text-slate-400">
                      No cards remain in hand
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 lg:w-48 lg:flex-col">
              <div className="hidden rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-5 text-slate-400 lg:block">
                <div className="flex items-center gap-2 font-semibold text-slate-200">
                  <Zap className="h-4 w-4 text-amber-200" aria-hidden="true" />
                  {gameState.currentEnergy} energy left
                </div>
                Unspent cards are discarded when the turn ends.
              </div>
              <Button
                fullWidth
                size="lg"
                onClick={handleEndTurn}
                disabled={combatLocked}
                isLoading={isEndingTurn}
                loadingLabel="Resolving turn..."
              >
                End turn
              </Button>
            </div>
          </div>
        </div>
      </footer>

      <GameModal
        isOpen={showVictory}
        onClose={() => setShowVictory(false)}
        type="victory"
        rewards={rewards}
        onNextFloor={onComplete}
      />
      <GameModal
        isOpen={showDefeat}
        onClose={() => setShowDefeat(false)}
        type="defeat"
        onRevive={handleRevive}
        crystalCost={REVIVE_COST}
        userCrystals={userCrystals}
      />

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
