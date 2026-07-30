"use client";

import { useState } from "react";
import { Crosshair, ShieldCheck, Sparkles, Swords, WandSparkles } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import { useCharacter } from "@/context/character-context";
import {
  CHARACTER_NAME_MAX_LENGTH,
  getCharacterCreationError,
  normalizeCharacterName,
  type FightingStyleValue,
} from "@/lib/game/character-creation";

interface CharacterCreationProps {
  onCreated?: () => void;
}

const classOptions: Record<
  FightingStyleValue,
  {
    title: string;
    description: string;
    strength: string;
    icon: typeof Swords;
    tone: string;
  }
> = {
  MELEE: {
    title: "Ironbound",
    description: "Direct attacks and dependable defense. The clearest first path.",
    strength: "Reliable damage · Strong block",
    icon: Swords,
    tone: "border-red-200 bg-red-50 text-red-800",
  },
  RANGE: {
    title: "Trickshot",
    description: "Fast repeated attacks built around precise sequencing.",
    strength: "Multi-hit · Flexible tempo",
    icon: Crosshair,
    tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  MAGIC: {
    title: "Hexbinder",
    description: "Costly spells with area damage and future utility potential.",
    strength: "Area damage · High impact",
    icon: WandSparkles,
    tone: "border-violet-200 bg-violet-50 text-violet-800",
  },
};

async function readError(response: Response) {
  const data = await response.json().catch(() => null);
  return data?.message || "Failed to create character";
}

export default function CharacterCreation({ onCreated }: CharacterCreationProps) {
  const { fetchCharacters } = useCharacter();
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState<FightingStyleValue>("MELEE");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = getCharacterCreationError(name, selectedClass);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: normalizeCharacterName(name),
          class: selectedClass,
        }),
      });

      if (!response.ok) throw new Error(await readError(response));

      await fetchCharacters();
      toast.success("Your delver is ready");
      onCreated?.();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to create character"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl">
      <div className="bg-[radial-gradient(circle_at_top,#38232b_0%,#17151b_70%)] p-6 text-white sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-amber-200">
            <Sparkles className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-amber-200/70 uppercase">
              First expedition
            </p>
            <h2 className="mt-1 font-medievalsharp text-3xl sm:text-4xl">
              Create your delver
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Choose a readable starting style. Classes currently change the starter card that completes your opening deck.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7 p-5 sm:p-8">
        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
            {error}
          </div>
        )}

        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="character-name" className="font-semibold text-slate-900">
              Character name
            </label>
            <span className="text-xs tabular-nums text-slate-500">
              {name.length}/{CHARACTER_NAME_MAX_LENGTH}
            </span>
          </div>
          <input
            id="character-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={CHARACTER_NAME_MAX_LENGTH}
            autoComplete="off"
            autoFocus
            placeholder="Example: Vale"
            className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none"
          />
          <p className="mt-2 text-sm text-slate-500">
            3–24 characters. Letters, numbers, spaces, apostrophes, and hyphens are allowed.
          </p>
        </div>

        <fieldset>
          <legend className="font-semibold text-slate-900">Choose a fighting style</legend>
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            {(Object.entries(classOptions) as [FightingStyleValue, (typeof classOptions)[FightingStyleValue]][]).map(
              ([style, option]) => {
                const Icon = option.icon;
                const isSelected = selectedClass === style;

                return (
                  <button
                    key={style}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedClass(style)}
                    className={`relative rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-4 focus-visible:ring-primary/25 focus-visible:outline-none ${option.tone} ${
                      isSelected ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                  >
                    {style === "MELEE" && (
                      <span className="absolute top-3 right-3 rounded-full bg-white/75 px-2 py-1 text-[9px] font-bold tracking-wide uppercase">
                        Recommended
                      </span>
                    )}
                    <Icon className="h-6 w-6" aria-hidden="true" />
                    <h3 className="mt-4 font-medievalsharp text-2xl">{option.title}</h3>
                    <p className="mt-2 text-sm leading-6 opacity-80">{option.description}</p>
                    <p className="mt-4 text-[10px] font-bold tracking-[0.16em] uppercase opacity-65">
                      {option.strength}
                    </p>
                  </button>
                );
              }
            )}
          </div>
        </fieldset>

        <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            Every delver begins with a starter weapon and nine-card deck.
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={!name.trim()}
          isLoading={isLoading}
          loadingLabel="Creating delver..."
          className="font-medievalsharp"
        >
          Begin as {classOptions[selectedClass].title}
        </Button>
      </form>
    </section>
  );
}
