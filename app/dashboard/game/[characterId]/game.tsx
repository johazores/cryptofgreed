"use client";
import { useState } from "react";
import { Character } from "@/types/character";
import GameScreen from "@/components/game/game-screen";
import { useRouter } from "next/navigation";

interface GameClientProps {
  initialCharacter: Character;
}

export default function GameClient({ initialCharacter }: GameClientProps) {
  const [character] = useState<Character>(initialCharacter);
  const router = useRouter();

  return (
    <GameScreen
      character={character}
      onExit={() => router.push("/dashboard")}
    />
  );
}
