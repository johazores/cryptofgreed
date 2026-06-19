"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useCharacter } from "@/context/character-context";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import GameClient from "./game";
import Loader from "@/components/ui/loader";
import { ItemStats } from "@/types/character";

export default function GamePage({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const { characterId } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { character, fetchCharacter } = useCharacter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initializeGame() {
      if (status === "unauthenticated") {
        router.push("/");
        return;
      }

      if (status === "authenticated") {
        try {
          await fetchCharacter(characterId);
          if (mounted) {
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error fetching character:", error);
          router.push("/dashboard");
        }
      }
    }

    initializeGame();

    return () => {
      mounted = false;
    };
  }, [status, characterId, router, fetchCharacter]);

  // Add check for character death
  useEffect(() => {
    if (character?.isDead) {
      router.push("/dashboard");
      return;
    }
  }, [character, router]);

  if (status === "loading" || isLoading) {
    return <Loader fullScreen className="h-8 w-8" />;
  }

  if (!character) {
    return null;
  }

  return (
    <GameClient
      initialCharacter={{
        ...character,
        floor: character.level || 1,
        block: 0,
        deck: [],
        hand: [],
        discardPile: [],
        equipment: (character.equipment || []).map((eq) => ({
          ...eq,
          stats: eq.stats as ItemStats,
        })),
      }}
    />
  );
}
