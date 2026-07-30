"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CharacterCreation from "@/components/character-creation";
import Loader from "@/components/ui/loader";
import CharacterSelection from "@/components/character-selection";
import { useCharacter } from "@/context/character-context";
import { REVIVE_COST } from "@/lib/game/revival";
import { toast } from "sonner";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { characters, fetchCharacters, reviveCharacter } = useCharacter();
  const [crystals, setCrystals] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCrystals = async () => {
    try {
      const response = await fetch("/api/user/crystals");
      if (!response.ok) return;

      const data = await response.json();
      setCrystals(data.crystals);
    } catch (error) {
      console.error("Failed to fetch crystals:", error);
    }
  };

  const handleRevive = async (characterId: string) => {
    if (crystals < REVIVE_COST) {
      toast.error(
        `You need ${REVIVE_COST} crystals to revive your character`
      );
      return;
    }

    try {
      const result = await reviveCharacter(characterId);
      setCrystals(result.crystalsRemaining);
    } catch {
      // The character context displays the server error.
    }
  };

  useEffect(() => {
    async function initializeData() {
      try {
        await Promise.all([fetchCharacters(), fetchCrystals()]);
      } finally {
        setLoading(false);
      }
    }

    initializeData();
  }, [fetchCharacters]);

  if (loading) {
    return <Loader fullScreen className="h-8 w-8" />;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-12 text-center">
        <h1 className="text-primary mb-2 font-medievalsharp text-4xl font-bold">
          Crypt of Greed
        </h1>
        <p className="text-gray-600">
          Welcome back, {session?.user?.email?.split("@")[0]}
        </p>
        <p className="text-primary mt-2 text-sm">Crystals: {crystals}</p>
      </div>

      {characters.length === 0 ? (
        <CharacterCreation />
      ) : (
        <>
          <h2 className="mb-6 text-center font-medievalsharp text-2xl">
            Select Your Character
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {characters.map((character) => (
              <CharacterSelection
                key={character.id}
                character={character}
                onRevive={handleRevive}
                crystals={crystals}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
