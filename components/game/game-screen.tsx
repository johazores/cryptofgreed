import Combat from "./combat";
import { useCharacter } from "@/context/character-context";

interface GameScreenProps {
  onExit: () => void;
}

export default function GameScreen({ onExit }: GameScreenProps) {
  const { character, updateCharacter } = useCharacter();

  if (!character) return null;

  return (
    <div className="h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex justify-end mb-4">
          <button
            onClick={onExit}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded"
          >
            Exit Game
          </button>
        </div>
        <Combat onCombatEnd={() => updateCharacter(character.id)} />
      </div>
    </div>
  );
}
