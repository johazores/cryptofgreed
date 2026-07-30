"use client";

import { useMemo, useState } from "react";
import { Coins, DoorOpen, HeartPulse, Landmark, Pickaxe } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import { useCharacter } from "@/context/character-context";
import RoomShell from "../room-shell";

interface EventProps {
  onContinue: () => void | Promise<void>;
  isAdvancing?: boolean;
}

type EventChoice = {
  id: "offer" | "break" | "leave";
  title: string;
  summary: string;
  disabled: boolean;
};

export default function Event({ onContinue, isAdvancing = false }: EventProps) {
  const { character, updateCharacter } = useCharacter();
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  const choices = useMemo<EventChoice[]>(() => {
    if (!character) return [];

    return [
      {
        id: "offer",
        title: "Offer 15 gold",
        summary: "Recover 25% of maximum health.",
        disabled: character.gold < 15 || character.currentHealth >= character.maxHealth,
      },
      {
        id: "break",
        title: "Break the seal",
        summary: "Lose 10 health and take 30 gold.",
        disabled: character.currentHealth <= 10,
      },
      {
        id: "leave",
        title: "Leave untouched",
        summary: "Continue without accepting the shrine's bargain.",
        disabled: false,
      },
    ];
  }, [character]);

  if (!character) return null;

  const handleChoice = async (choice: EventChoice) => {
    if (selectedOutcome || choice.disabled) return;
    setSelectedChoiceId(choice.id);

    try {
      if (choice.id === "offer") {
        const healing = Math.min(
          Math.floor(character.maxHealth * 0.25),
          character.maxHealth - character.currentHealth
        );
        await updateCharacter(character.id, {
          gold: character.gold - 15,
          currentHealth: character.currentHealth + healing,
        });
        setSelectedOutcome(
          `The shrine takes your offering. Warm light closes your wounds and restores ${healing} health.`
        );
      } else if (choice.id === "break") {
        await updateCharacter(character.id, {
          gold: character.gold + 30,
          currentHealth: character.currentHealth - 10,
        });
        setSelectedOutcome(
          "The seal fractures. Coins spill from the stone, but the backlash tears through you for 10 health."
        );
      } else {
        setSelectedOutcome(
          "You step away. The shrine's whisper follows you, but its bargain remains unclaimed."
        );
      }
    } catch (error) {
      toast.error("The shrine resisted your choice");
      console.error("Failed to resolve event:", error);
    } finally {
      setSelectedChoiceId(null);
    }
  };

  return (
    <RoomShell
      icon={<Landmark className="h-7 w-7" aria-hidden="true" />}
      eyebrow="Unknown chamber"
      title="The Sealed Shrine"
      description="A bargain waits beneath the dust. Every option explains its cost before you commit."
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-100 to-amber-50 p-5">
          <p className="text-sm leading-7 text-slate-700">
            The altar hums as you approach. Coins have been pressed into its
            surface, and a dark seam runs through the central seal.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <EventStat icon={Coins} label="Gold" value={character.gold} />
            <EventStat
              icon={HeartPulse}
              label="Health"
              value={`${character.currentHealth}/${character.maxHealth}`}
            />
          </div>
        </div>

        <div>
          {!selectedOutcome ? (
            <div className="space-y-3">
              {choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => handleChoice(choice)}
                  disabled={choice.disabled || selectedChoiceId !== null}
                  className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-primary/35 hover:bg-primary/[0.03] focus-visible:ring-4 focus-visible:ring-primary/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-slate-100 p-2 text-slate-700">
                      {choice.id === "offer" ? (
                        <Coins className="h-5 w-5" aria-hidden="true" />
                      ) : choice.id === "break" ? (
                        <Pickaxe className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <DoorOpen className="h-5 w-5" aria-hidden="true" />
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-950">
                        {choice.title}
                      </h2>
                      <p className="mt-1 text-sm leading-5 text-slate-600">
                        {choice.summary}
                      </p>
                      {choice.disabled && (
                        <p className="mt-2 text-xs font-semibold text-red-700">
                          Requirements not met
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-xs font-bold tracking-[0.2em] text-amber-800 uppercase">
                Outcome
              </p>
              <p className="mt-3 text-base leading-7 text-amber-950">
                {selectedOutcome}
              </p>
              <Button
                className="mt-5"
                fullWidth
                size="lg"
                onClick={onContinue}
                isLoading={isAdvancing}
                loadingLabel="Opening the path..."
              >
                Continue deeper
              </Button>
            </div>
          )}
        </div>
      </div>
    </RoomShell>
  );
}

function EventStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Coins;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-white/70 bg-white/70 p-3 text-center shadow-sm">
      <Icon className="mx-auto h-5 w-5 text-primary" aria-hidden="true" />
      <p className="mt-1 text-[10px] font-bold tracking-wide text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-0.5 font-bold text-slate-950 tabular-nums">{value}</p>
    </div>
  );
}
