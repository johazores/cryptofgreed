"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Gem, Plus, RefreshCw, Shield, Skull, Swords } from "lucide-react";
import { toast } from "sonner";
import CharacterCreation from "@/components/character/character-creation";
import CharacterSelection from "@/components/character/character-selection";
import Button from "@/components/ui/button";
import { useCharacter } from "@/context/character-context";
import { REVIVE_COST } from "@/lib/game/revival";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { characters, fetchCharacters, reviveCharacter } = useCharacter();
  const [crystals, setCrystals] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showCreation, setShowCreation] = useState(false);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const crystalsResponse = await fetch("/api/user/crystals");
      if (!crystalsResponse.ok) throw new Error("Failed to load crystal balance");
      const crystalData = await crystalsResponse.json();

      await fetchCharacters();
      setCrystals(crystalData.crystals);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
      setLoadError(
        "Your characters could not be loaded. Check the database connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [fetchCharacters]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleRevive = async (characterId: string) => {
    if (crystals < REVIVE_COST) {
      toast.error(`You need ${REVIVE_COST} crystals to revive this character`);
      return;
    }

    try {
      const result = await reviveCharacter(characterId);
      setCrystals(result.crystalsRemaining);
    } catch {
      // The character context already displays the server error.
    }
  };

  const dashboardStats = useMemo(() => {
    const livingCharacters = characters.filter(
      (character) => !character.isDead
    ).length;
    const deepestFloor = characters.reduce(
      (deepest, character) => Math.max(deepest, character.floor),
      0
    );

    return { livingCharacters, deepestFloor };
  }, [characters]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top,#2d2027_0%,#111217_38%,#f4f1ea_38%)] px-3 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-white/10 bg-black/30 p-5 text-white shadow-2xl backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.22em] text-amber-200/70 uppercase">
                Delver roster
              </p>
              <h1 className="mt-2 font-medievalsharp text-4xl sm:text-5xl">
                Welcome back,{" "}
                {session?.user?.name ||
                  session?.user?.email?.split("@")[0] ||
                  "adventurer"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Continue an expedition, recover a fallen delver, or prepare a new
                path into the crypt.
              </p>
            </div>
            {characters.length > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowCreation((current) => !current)}
                className="border-white/20 bg-white/10 text-white hover:bg-white/15"
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
                {showCreation ? "Hide creation" : "Create new delver"}
              </Button>
            )}
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <HeaderStat
              icon={Swords}
              label="Characters"
              value={characters.length}
            />
            <HeaderStat
              icon={Shield}
              label="Ready"
              value={dashboardStats.livingCharacters}
            />
            <HeaderStat
              icon={Skull}
              label="Deepest floor"
              value={dashboardStats.deepestFloor || "—"}
            />
            <HeaderStat icon={Gem} label="Crystals" value={crystals} />
          </div>
        </header>

        {loadError ? (
          <section className="mt-6 rounded-2xl border border-red-200 bg-white p-6 text-center shadow-xl">
            <h2 className="font-medievalsharp text-3xl text-red-800">
              Dashboard unavailable
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
              {loadError}
            </p>
            <Button className="mt-5" onClick={loadDashboard}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Retry
            </Button>
          </section>
        ) : (
          <div className="mt-6 space-y-6">
            {(characters.length === 0 || showCreation) && (
              <CharacterCreation onCreated={() => setShowCreation(false)} />
            )}

            {characters.length > 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-xl sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">
                      Active roster
                    </p>
                    <h2 className="mt-1 font-medievalsharp text-3xl text-slate-950">
                      Choose a character
                    </h2>
                  </div>
                  <p className="text-sm text-slate-500">
                    Progress and equipment are stored per character.
                  </p>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {characters.map((character) => (
                    <CharacterSelection
                      key={character.id}
                      character={character}
                      onRevive={handleRevive}
                      crystals={crystals}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function HeaderStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Swords;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
      <Icon className="h-5 w-5 text-amber-200" aria-hidden="true" />
      <p className="mt-2 text-[9px] font-bold tracking-[0.18em] text-slate-400 uppercase">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold tabular-nums text-white">{value}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-3 py-8 sm:px-6">
      <div
        className="mx-auto max-w-7xl animate-pulse space-y-6"
        aria-label="Loading dashboard"
      >
        <div className="h-64 rounded-3xl bg-white/10" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-80 rounded-2xl bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
