"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CharacterCreation from "@/components/character-creation";
import Loader from "@/components/ui/loader";
import CharacterStats from "@/components/game/character-stats";
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
              <div
                key={character.id}
                className={`relative overflow-hidden rounded-lg border-2 ${
                  character.isDead
                    ? "border-red-800 opacity-75"
                    : "border-primary/30 hover:border-primary"
                } transition-all duration-300 transform hover:scale-105`}
              >
                <div className="bg-gradient-to-b from-primary/10 to-transparent flex justify-center flex-col items-center p-4">
                  <CharacterStats character={character} />

                  <div className="mt-4 flex justify-center gap-2">
                    {character.isDead ? (
                      <button
                        onClick={() => handleRevive(character.id)}
                        disabled={crystals < 100}
                        className={`w-full py-3 px-6 rounded-lg font-medievalsharp text-lg ${
                          crystals < 100
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        } text-white transition-colors duration-200`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 001.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Revive (100 Crystals)
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          router.push(`/dashboard/game/${character.id}`)
                        }
                        className="w-full py-3 px-6 rounded-lg font-medievalsharp text-lg bg-primary hover:bg-primary-dark text-white transition-colors duration-200"
                      >
                        Enter the Crypt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
