"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { Character } from "@/types/character";
import { toast } from "sonner";

interface CharacterContextType {
  character: Character | null;
  characters: Character[];
  setCharacter: (character: Character) => void;
  updateCharacter: (characterId: string) => Promise<void>;
  fetchCharacters: () => Promise<void>;
  reviveCharacter: (characterId: string) => Promise<void>;
  updateCharacterStats: (
    characterId: string,
    updates: Partial<Character>
  ) => Promise<void>;
  markCharacterAsDead: (characterId: string) => Promise<void>;
}

const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined
);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);

  const fetchCharacters = useCallback(async () => {
    try {
      const response = await fetch("/api/characters");
      if (!response.ok) throw new Error("Failed to fetch characters");
      const data = await response.json();
      setCharacters(data);
    } catch (error) {
      console.error("Failed to fetch characters:", error);
      toast.error("Failed to load characters");
    }
  }, []);

  const updateCharacter = useCallback(async (characterId: string) => {
    try {
      const response = await fetch(`/api/characters/${characterId}`);
      if (!response.ok) throw new Error("Failed to fetch character");
      const data = await response.json();
      setCharacter(data);
      // Also update the character in the characters array
      setCharacters((prev) =>
        prev.map((c) => (c.id === characterId ? data : c))
      );
    } catch (error) {
      console.error("Error updating character:", error);
    }
  }, []);

  const reviveCharacter = useCallback(
    async (characterId: string) => {
      try {
        const response = await fetch("/api/characters/revive", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ characterId }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to revive character");
        }

        toast.success("Character revived successfully!");
        await fetchCharacters();

        // If the revived character is the current character, update it
        if (character?.id === characterId) {
          await updateCharacter(characterId);
        }
      } catch (error) {
        console.error("Failed to revive character:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to revive character"
        );
        throw error;
      }
    },
    [character, fetchCharacters, updateCharacter]
  );

  const updateCharacterStats = useCallback(
    async (characterId: string, updates: Partial<Character>) => {
      try {
        const response = await fetch("/api/characters/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            characterId,
            updates,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update character stats");
        }

        await updateCharacter(characterId);
      } catch (error) {
        console.error("Failed to update character:", error);
        throw error;
      }
    },
    [updateCharacter]
  );

  const markCharacterAsDead = useCallback(
    async (characterId: string) => {
      try {
        await updateCharacterStats(characterId, {
          isDead: true,
          currentHealth: 0,
        });
      } catch (error) {
        console.error("Failed to update character death status:", error);
        throw error;
      }
    },
    [updateCharacterStats]
  );

  return (
    <CharacterContext.Provider
      value={{
        character,
        characters,
        setCharacter,
        updateCharacter,
        fetchCharacters,
        reviveCharacter,
        updateCharacterStats,
        markCharacterAsDead,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
}

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error("useCharacter must be used within a CharacterProvider");
  }
  return context;
};
