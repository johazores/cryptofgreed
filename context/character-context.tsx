"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Character } from "@/types/character";
import { toast } from "sonner";

interface CharacterContextType {
  character: Character | null;
  characters: Character[];
  setCharacter: (character: Character) => void;
  updateCharacter: (
    characterId: string,
    updates?: Partial<Character>
  ) => Promise<Character>;
  fetchCharacters: () => Promise<void>;
  fetchCharacter: (characterId: string) => Promise<void>;
  reviveCharacter: (characterId: string) => Promise<void>;
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
      // Ensure equipment is properly included in each character
      const charactersWithEquipment = data.map((char: Character) => ({
        ...char,
        equipment: char.equipment || [],
      }));
      setCharacters(charactersWithEquipment);
    } catch (error) {
      toast.error("Failed to load characters");
    }
  }, []);

  const fetchCharacter = useCallback(async (characterId: string) => {
    try {
      const response = await fetch("/api/characters/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ characterId }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const data = await response.json();
      // Ensure equipment is properly included
      const characterWithEquipment = {
        ...data,
        equipment: data.equipment || [],
      };
      setCharacter(characterWithEquipment);
      return characterWithEquipment;
    } catch (error) {
      console.error("Failed to fetch character:", error);
      throw error;
    }
  }, []);

  const updateCharacter = useCallback(
    async (characterId: string, updates?: Partial<Character>) => {
      if (!characterId) {
        throw new Error("Character ID is required");
      }

      try {
        const response = await fetch("/api/characters/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            characterId,
            updates: {
              ...updates,
              currentHealth: updates?.currentHealth ?? undefined,
              gold: updates?.gold ?? undefined,
              experience: updates?.experience ?? undefined,
              monstersSlain: updates?.monstersSlain ?? undefined,
              equipment: updates?.equipment ?? undefined, // Make sure equipment updates are included
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to update character");
        }

        const updatedCharacter = await response.json();
        // Ensure equipment is properly included in the updated character
        const characterWithEquipment = {
          ...updatedCharacter,
          equipment: updatedCharacter.equipment || [],
        };

        setCharacter((prev) =>
          prev?.id === characterId ? characterWithEquipment : prev
        );
        setCharacters((prev) =>
          prev.map((char) =>
            char.id === characterId ? characterWithEquipment : char
          )
        );

        return characterWithEquipment;
      } catch (error) {
        console.error("Error updating character:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to update character"
        );
        throw error;
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      character,
      characters,
      setCharacter,
      updateCharacter,
      fetchCharacters,
      fetchCharacter,
      reviveCharacter: async (characterId: string) => {
        await updateCharacter(characterId, {
          isDead: false,
          currentHealth: character?.maxHealth,
        });
      },
      markCharacterAsDead: async (characterId: string) => {
        await updateCharacter(characterId, { isDead: true });
      },
    }),
    [character, characters, updateCharacter, fetchCharacters, fetchCharacter]
  );

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error("useCharacter must be used within a CharacterProvider");
  }
  return context;
}
