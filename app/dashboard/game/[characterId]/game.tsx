"use client";
import { useEffect } from "react";
import GameScreen from "@/components/game/game-screen";
import { useRouter } from "next/navigation";
import { useCharacter } from "@/context/character-context";
import { Character } from "@/types/character";

interface GameClientProps {
  initialCharacter: Character;
}

export default function GameClient({ initialCharacter }: GameClientProps) {
  const router = useRouter();
  const { setCharacter } = useCharacter();

  useEffect(() => {
    setCharacter(initialCharacter);
  }, [initialCharacter, setCharacter]);

  return <GameScreen onExit={() => router.push("/dashboard")} />;
}
