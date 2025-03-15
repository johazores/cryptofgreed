import { Character } from "@/types/character";
import Combat from "./combat";

interface GameScreenProps {
  character: Character;
  onExit: () => void;
}

export default function GameScreen({ character, onExit }: GameScreenProps) {
  const handleCombatEnd = () => {
    // Handle combat end logic
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex justify-end mb-4">
          <button
            onClick={onExit}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded"
          >
            Abandon Run
          </button>
        </div>

        <Combat character={character} onCombatEnd={handleCombatEnd} />
      </div>
    </div>
  );
}
