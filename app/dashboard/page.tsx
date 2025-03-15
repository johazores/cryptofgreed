"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CharacterCreation from "@/components/character-creation";
import Loader from "@/components/ui/loader";
import CharacterSelection from "@/components/character-selection";
import { useCharacter } from "@/context/character-context";
import { toast } from "sonner";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { characters, fetchCharacters, reviveCharacter } = useCharacter();
  const [crystals, setCrystals] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCrystals = async () => {
    try {
      const response = await fetch("/api/user/crystals");
      if (response.ok) {
        const data = await response.json();
        setCrystals(data.crystals);
      }
    } catch (error) {
      console.error("Failed to fetch crystals:", error);
    }
  };

  const handleRevive = async (characterId: string) => {
    if (crystals < 100) {
      toast.error("You need 100 crystals to revive your character");
      return;
    }

    try {
      await reviveCharacter(characterId);
      await fetchCrystals(); // Refresh crystals after revival
    } catch (error) {
      // Error handling is done in the context
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
      <div className="text-center mb-12">
        <h1 className="font-medievalsharp text-4xl font-bold text-primary mb-2">
          Crypt of Greed
        </h1>
        <p className="text-gray-600">
          Welcome back, {session?.user?.email?.split("@")[0]}
        </p>
        <p className="text-sm text-primary mt-2">Crystals: {crystals}</p>
      </div>

      {characters.length === 0 ? (
        <CharacterCreation />
      ) : (
        <>
          <h2 className="font-medievalsharp text-2xl mb-6 text-center">
            Select Your Champion
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
