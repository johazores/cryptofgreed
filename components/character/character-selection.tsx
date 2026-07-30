"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Backpack,
  Coins,
  Crosshair,
  Gem,
  HeartPulse,
  Shield,
  Skull,
  Swords,
  WandSparkles,
} from "lucide-react";
import Button from "@/components/ui/button";
import type { Character } from "@/types/character";
import { REVIVE_COST } from "@/lib/game/revival";

interface CharacterSelectionProps {
  character: Character;
  onRevive: (characterId: string) => void | Promise<void>;
  crystals: number;
}

const classDetails = {
  MELEE: { label: "Ironbound", icon: Swords },
  RANGE: { label: "Trickshot", icon: Crosshair },
  MAGIC: { label: "Hexbinder", icon: WandSparkles },
} as const;

function clampPercentage(value: number) {
  return Math.max(0, Math.min(100, value));
}

export default function CharacterSelection({
  character,
  onRevive,
  crystals,
}: CharacterSelectionProps) {
  const router = useRouter();
  const [isReviving, setIsReviving] = useState(false);
  const details = classDetails[character.class];
  const ClassIcon = details.icon;
  const healthPercentage = clampPercentage(
    (character.currentHealth / Math.max(1, character.maxHealth)) * 100
  );
  const expPercentage = clampPercentage(character.experience % 100);
  const canRevive = crystals >= REVIVE_COST;

  const handleRevive = async () => {
    if (!canRevive || isReviving) return;
    setIsReviving(true);
    try {
      await onRevive(character.id);
    } finally {
      setIsReviving(false);
    }
  };

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl ${
        character.isDead ? "border-red-300" : "border-slate-200"
      }`}
    >
      <div
        className={`h-1.5 w-full ${
          character.isDead
            ? "bg-red-500"
            : "bg-gradient-to-r from-primary via-amber-600 to-primary"
        }`}
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-xl p-3 ${
                character.isDead
                  ? "bg-red-100 text-red-700"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <ClassIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-medievalsharp text-2xl text-slate-950">
                  {character.name}
                </h2>
                {character.isDead && (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-[9px] font-bold tracking-wide text-red-700 uppercase">
                    Fallen
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                {details.label} · Level {character.level} · Floor {character.floor}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-900 tabular-nums">
            <Coins className="h-4 w-4" aria-hidden="true" />
            {character.gold}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <ProgressRow
            icon={HeartPulse}
            label="Health"
            value={`${character.currentHealth}/${character.maxHealth}`}
            percentage={healthPercentage}
            barClassName="bg-gradient-to-r from-red-500 to-rose-400"
          />
          <ProgressRow
            icon={Shield}
            label="Experience"
            value={`${character.experience % 100}/100`}
            percentage={expPercentage}
            barClassName="bg-gradient-to-r from-sky-500 to-cyan-300"
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <MiniStat icon={Skull} label="Monsters slain" value={character.monstersSlain} />
          <MiniStat icon={Backpack} label="Equipment" value={character.equipment.length} />
        </div>

        <div className="mt-auto pt-5">
          {character.isDead ? (
            <div className="space-y-3">
              <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-sm text-violet-900">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 font-semibold">
                    <Gem className="h-4 w-4" aria-hidden="true" />
                    Revival
                  </span>
                  <span className="font-bold tabular-nums">{REVIVE_COST}</span>
                </div>
                {!canRevive && (
                  <p className="mt-2 text-xs text-violet-800">
                    You currently have {crystals} crystals.
                  </p>
                )}
              </div>
              <Button
                fullWidth
                variant="danger"
                onClick={handleRevive}
                disabled={!canRevive}
                isLoading={isReviving}
                loadingLabel="Reviving..."
              >
                {canRevive ? "Revive character" : "Not enough crystals"}
              </Button>
            </div>
          ) : (
            <Button
              fullWidth
              size="lg"
              onClick={() => router.push(`/dashboard/game/${character.id}`)}
              className="font-medievalsharp"
            >
              Enter the crypt
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

function ProgressRow({
  icon: Icon,
  label,
  value,
  percentage,
  barClassName,
}: {
  icon: typeof HeartPulse;
  label: string;
  value: string;
  percentage: number;
  barClassName: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
        <span className="flex items-center gap-1.5 text-slate-600">
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {label}
        </span>
        <span className="tabular-nums text-slate-900">{value}</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentage)}
        className="h-2 overflow-hidden rounded-full bg-slate-100"
      >
        <div className={`h-full rounded-full ${barClassName}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Skull;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
      <Icon className="mx-auto h-4 w-4 text-slate-500" aria-hidden="true" />
      <p className="mt-1 text-[9px] font-bold tracking-wide text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-0.5 font-bold text-slate-950 tabular-nums">{value}</p>
    </div>
  );
}
