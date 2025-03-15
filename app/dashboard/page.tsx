"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CharacterCreation from "@/components/character-creation";
import { Character } from "@/types/character";
import Loader from "@/components/ui/loader";
import GameScreen from "@/components/game/game-screen";
import CharacterStats from "@/components/game/character-stats";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function fetchCharacters() {
      try {
        const response = await fetch("/api/characters");
        if (response.ok) {
          const data = await response.json();
          setCharacters(data);
        }
      } catch (error) {
        console.error("Failed to fetch characters:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCharacters();
  }, []);

  if (loading) {
    return <Loader fullScreen className="h-8 w-8" />;
  }

  if (isPlaying && selectedCharacter) {
    return (
      <GameScreen
        character={selectedCharacter}
        onExit={() => {
          setIsPlaying(false);
          setSelectedCharacter(null);
        }}
      />
    );
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

                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => {
                        setSelectedCharacter(character);
                        setIsPlaying(true);
                      }}
                      disabled={character.isDead}
                      className={`w-full py-3 px-6 rounded-lg font-medievalsharp text-lg ${
                        character.isDead
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-primary hover:bg-primary-dark"
                      } text-white transition-colors duration-200`}
                    >
                      {character.isDead ? (
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
                          Fallen
                        </span>
                      ) : (
                        "Enter the Crypt"
                      )}
                    </button>
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
