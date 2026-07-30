"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Character } from "@/types/character";
import { toast } from "sonner";

type CharacterUpdates = Omit<Partial<Character>, "isDead">;

export type RevivalResult = {
  character: Character;
  crystalsRemaining: number;
};

interface CharacterContextType {
  character: Character | null;
  characters: Character[];
  setCharacter: (character: Character) => void;
  updateCharacter: (
    characterId: string,
    updates?: CharacterUpdates
  ) => Promise<Character>;
  fetchCharacters: () => Promise<void>;
  fetchCharacter: (characterId: string) => Promise<Character>;
  reviveCharacter: (characterId: string) => Promise<RevivalResult>;
  markCharacterAsDead: (characterId: string) => Promise<Character>;
}

const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined
);

function normalizeCharacter(data: Character): Character {
  return {
    ...data,
    equipment: data.equipment || [],
    powers: data.powers || [],
  };
}

async function readResponseError(response: Response, fallback: string) {
  const data = await response.json().catch(() => null);
  return data?.message || fallback;
}

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);

  const applyCharacter = useCallback((data: Character) => {
    const normalized = normalizeCharacter(data);

    setCharacter((current) =>
      current?.id === normalized.id ? normalized : current
    );
    setCharacters((current) =>
      current.map((item) => (item.id === normalized.id ? normalized : item))
    );

    return normalized;
  }, []);

  const fetchCharacters = useCallback(async () => {
    try {
      const response = await fetch("/api/characters");
      if (!response.ok) throw new Error("Failed to fetch characters");

      const data: Character[] = await response.json();
      setCharacters(data.map(normalizeCharacter));
    } catch (error) {
      toast.error("Failed to load characters");
      throw error;
    }
  }, []);

  const fetchCharacter = useCallback(async (characterId: string) => {
    const response = await fetch("/api/characters/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characterId }),
    });

    if (!response.ok) {
      throw new Error(
        await readResponseError(response, "Failed to fetch character")
      );
    }

    const normalized = normalizeCharacter(await response.json());
    setCharacter(normalized);
    return normalized;
  }, []);

  const updateCharacter = useCallback(
    async (characterId: string, updates?: CharacterUpdates) => {
      if (!characterId) throw new Error("Character ID is required");

      try {
        const response = await fetch("/api/characters/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ characterId, updates }),
        });

        if (!response.ok) {
          throw new Error(
            await readResponseError(response, "Failed to update character")
          );
        }

        return applyCharacter(await response.json());
      } catch (error) {
        console.error("Error updating character:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to update character"
        );
        throw error;
      }
    },
    [applyCharacter]
  );

  const reviveCharacter = useCallback(
    async (characterId: string): Promise<RevivalResult> => {
      try {
        const response = await fetch("/api/characters/revive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ characterId }),
        });

        if (!response.ok) {
          throw new Error(
            await readResponseError(response, "Failed to revive character")
          );
        }

        const data = await response.json();
        return {
          character: applyCharacter(data.character),
          crystalsRemaining: data.crystalsRemaining,
        };
      } catch (error) {
        console.error("Error reviving character:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to revive character"
        );
        throw error;
      }
    },
    [applyCharacter]
  );

  const markCharacterAsDead = useCallback(
    async (characterId: string) => {
      try {
        const response = await fetch("/api/character/death", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ characterId }),
        });

        if (!response.ok) {
          throw new Error(
            await readResponseError(response, "Failed to mark character as dead")
          );
        }

        return applyCharacter(await response.json());
      } catch (error) {
        console.error("Error marking character as dead:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to mark character as dead"
        );
        throw error;
      }
    },
    [applyCharacter]
  );

  const value = useMemo(
    () => ({
      character,
      characters,
      setCharacter,
      updateCharacter,
      fetchCharacters,
      fetchCharacter,
      reviveCharacter,
      markCharacterAsDead,
    }),
    [
      character,
      characters,
      updateCharacter,
      fetchCharacters,
      fetchCharacter,
      reviveCharacter,
      markCharacterAsDead,
    ]
  );

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error("useCharacter must be used within a CharacterProvider");
  }
  return context;
}
