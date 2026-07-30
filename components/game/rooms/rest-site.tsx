"use client";

import { useState } from "react";
import { Campfire, HeartPulse, MoonStar } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import { useCharacter } from "@/context/character-context";
import RoomShell from "../room-shell";

interface RestSiteProps {
  onContinue: () => void | Promise<void>;
  isAdvancing?: boolean;
}

export default function RestSite({
  onContinue,
  isAdvancing = false,
}: RestSiteProps) {
  const { character, updateCharacter } = useCharacter();
  const [isResting, setIsResting] = useState(false);

  if (!character) return null;

  const healAmount = Math.floor(character.maxHealth * 0.3);
  const missingHealth = character.maxHealth - character.currentHealth;
  const actualHeal = Math.min(healAmount, Math.max(0, missingHealth));
  const isFullHealth = actualHeal === 0;

  const handleRest = async () => {
    if (isResting || isFullHealth) return;
    setIsResting(true);

    try {
      await updateCharacter(character.id, {
        currentHealth: character.currentHealth + actualHeal,
      });
      toast.success(`Recovered ${actualHeal} health`);
      await onContinue();
    } catch (error) {
      console.error("Failed to rest:", error);
    } finally {
      setIsResting(false);
    }
  };

  return (
    <RoomShell
      icon={<Campfire className="h-7 w-7" aria-hidden="true" />}
      eyebrow="Safe chamber"
      title="The Quiet Ember"
      description="The crypt briefly loosens its grip. Recover before deciding how much deeper you are willing to go."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <HeartPulse className="h-7 w-7 text-emerald-700" aria-hidden="true" />
          <h2 className="mt-4 font-medievalsharp text-2xl text-emerald-950">
            Rest by the fire
          </h2>
          <p className="mt-2 text-sm leading-6 text-emerald-900/75">
            Recover 30% of maximum health, up to your current missing health.
          </p>
          <div className="mt-4 rounded-xl bg-white/70 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Current health</span>
              <span className="font-bold tabular-nums text-slate-950">
                {character.currentHealth}/{character.maxHealth}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-600">Health recovered</span>
              <span className="font-bold tabular-nums text-emerald-700">
                +{actualHeal}
              </span>
            </div>
          </div>
          <Button
            className="mt-4"
            fullWidth
            onClick={handleRest}
            disabled={isFullHealth || isAdvancing}
            isLoading={isResting}
            loadingLabel="Resting..."
          >
            {isFullHealth ? "Already at full health" : "Rest and continue"}
          </Button>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <MoonStar className="h-7 w-7 text-slate-600" aria-hidden="true" />
          <h2 className="mt-4 font-medievalsharp text-2xl text-slate-950">
            Keep moving
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Preserve momentum and leave without changing your health.
          </p>
          <div className="mt-4 rounded-xl bg-white p-4 text-sm leading-6 text-slate-600">
            Skipping is useful when you are already healthy or want to reach the
            next decision quickly.
          </div>
          <Button
            className="mt-4"
            fullWidth
            variant="outline"
            onClick={onContinue}
            isLoading={isAdvancing}
            loadingLabel="Opening the path..."
            disabled={isResting}
          >
            Skip the campfire
          </Button>
        </article>
      </div>
    </RoomShell>
  );
}
