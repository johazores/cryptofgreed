import Combat from "./combat";
import { useCharacter } from "@/context/character-context";

interface GameScreenProps {
  onExit: () => void;
}

export default function GameScreen({ onExit }: GameScreenProps) {
  const { character, updateCharacter } = useCharacter();

  if (!character) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex justify-end py-2 md:py-4">
          <button
            onClick={onExit}
            className="px-3 md:px-4 py-1.5 md:py-2 bg-primary hover:bg-primary-dark text-white rounded text-sm md:text-base"
          >
            Exit Game
          </button>
        </div>
        <Combat onCombatEnd={() => updateCharacter(character.id)} />
      </div>
    </div>
  );
}
