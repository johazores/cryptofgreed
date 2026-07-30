"use client";

import { useState } from "react";
import { Backpack, Coins, Footprints, Shield, Skull, Zap } from "lucide-react";
import type { GameState } from "@/lib/game/game-state";
import { useCharacter } from "@/context/character-context";
import type { Character } from "@/types/character";
import EquipmentModal from "./equipment-modal";

interface CharacterStatsProps {
  gameState?: GameState;
  character?: Character;
}

function clampPercentage(value: number) {
  return Math.max(0, Math.min(100, value));
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
  const healthPercentage = clampPercentage(
    (currentHealth / Math.max(1, character.maxHealth)) * 100
  );
  const experiencePercentage = clampPercentage(character.experience % 100);

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/90 text-white shadow-xl backdrop-blur">
        <div className="grid gap-4 p-4 lg:grid-cols-[minmax(190px,0.8fr)_minmax(260px,1.4fr)_auto] lg:items-center">
          <div className="flex items-center justify-between gap-3 lg:justify-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-medievalsharp text-xl leading-none">
                  {character.name}
                </h2>
                <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-1 text-[10px] font-bold tracking-wide text-amber-200 uppercase">
                  Level {character.level}
                </span>
              </div>
              <p className="mt-2 flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                <Footprints className="h-3.5 w-3.5" aria-hidden="true" />
                {character.class} · Floor {gameState?.floor ?? character.floor}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowEquipment(true)}
              aria-label="View equipped items and powers"
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-amber-200 transition hover:border-amber-300/30 hover:bg-amber-300/10 focus-visible:ring-4 focus-visible:ring-amber-300/30 focus-visible:outline-none"
            >
              <Backpack className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ProgressStat
              label="Health"
              value={`${currentHealth}/${character.maxHealth}`}
              percentage={healthPercentage}
              barClassName="bg-gradient-to-r from-red-500 to-rose-400"
            />
            <ProgressStat
              label="Experience"
              value={`${character.experience % 100}/100`}
              percentage={experiencePercentage}
              barClassName="bg-gradient-to-r from-sky-500 to-cyan-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[330px]">
            <StatItem icon={Shield} label="Block" value={gameState?.block ?? 0} />
            <StatItem
              icon={Zap}
              label="Energy"
              value={
                gameState
                  ? `${gameState.currentEnergy}/${gameState.maxEnergy}`
                  : character.energy
              }
            />
            <StatItem icon={Coins} label="Gold" value={character.gold} />
            <StatItem
              icon={Skull}
              label="Slain"
              value={character.monstersSlain}
            />
          </div>
        </div>
      </section>

      <EquipmentModal
        isOpen={showEquipment}
        onClose={() => setShowEquipment(false)}
        character={character}
      />
    </>
  );
}

interface ProgressStatProps {
  label: string;
  value: string;
  percentage: number;
  barClassName: string;
}

function ProgressStat({
  label,
  value,
  percentage,
  barClassName,
}: ProgressStatProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-300">{label}</span>
        <span className="tabular-nums text-white">{value}</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentage)}
        className="h-2 overflow-hidden rounded-full bg-white/10"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${barClassName}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface StatItemProps {
  icon: typeof Shield;
  label: string;
  value: number | string;
}

function StatItem({ icon: Icon, label, value }: StatItemProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-center">
      <Icon className="mx-auto h-4 w-4 text-amber-200" aria-hidden="true" />
      <div className="mt-1 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-bold tabular-nums text-white">
        {value}
      </div>
    </div>
  );
}
