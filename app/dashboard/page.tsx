"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CharacterCreation from "@/components/character-creation";

interface Character {
  id: string;
  name: string;
  class: string;
  currentHealth: number;
  maxHealth: number;
  energy: number;
  gold: number;
  equipment: any[];
  powers: any[];
  isDead: boolean;
  block: number;
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
}

interface Card {
  id: string;
  name: string;
  description: string;
  type: "ATTACK" | "SKILL" | "POWER";
  energy: number;
  effects: {
    damage?: number;
    block?: number;
    heal?: number;
    special?: string;
  };
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [loading, setLoading] = useState(true);

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

  const handleCharacterUpdate = (updatedCharacter: Character) => {
    setCharacters((chars) =>
      chars.map((char) =>
        char.id === updatedCharacter.id ? updatedCharacter : char
      )
    );
    setSelectedCharacter(updatedCharacter);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (selectedCharacter) {
    return (
      <div className="container mx-auto p-8">
        <button
          onClick={() => setSelectedCharacter(null)}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Characters
        </button>
      </div>
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
                <div className="bg-gradient-to-b from-primary/10 to-transparent p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medievalsharp text-xl font-bold">
                      {character.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        character.class === "MELEE"
                          ? "bg-red-100 text-red-800"
                          : character.class === "RANGE"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {character.class}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold">Health</span>
                        <span className="text-sm">
                          {character.currentHealth}/{character.maxHealth}
                        </span>
                      </div>
                      <div className="overflow-hidden h-2 rounded-full bg-gray-200">
                        <div
                          style={{
                            width: `${
                              (character.currentHealth / character.maxHealth) *
                              100
                            }%`,
                          }}
                          className={`h-full rounded-full ${
                            character.currentHealth < character.maxHealth * 0.3
                              ? "bg-red-500"
                              : character.currentHealth <
                                character.maxHealth * 0.7
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-yellow-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium">{character.gold}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium">{character.energy}</span>
                      </div>
                    </div>

                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setSelectedCharacter(character)}
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
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
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
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
