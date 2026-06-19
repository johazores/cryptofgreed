import { useRouter } from "next/navigation";
import Modal from "../modal";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "victory" | "defeat";
  rewards?: {
    gold: number;
    experience: number;
    floor: number;
  };
  onRevive?: () => void;
  onNextFloor?: () => void;
  crystalCost?: number;
  userCrystals?: number;
}

export default function GameModal({
  isOpen,
  onClose,
  type,
  rewards,
  onRevive,
  onNextFloor,
  crystalCost,
  userCrystals,
}: GameModalProps) {
  const router = useRouter();
  const canAffordRevive =
    userCrystals && crystalCost ? userCrystals >= crystalCost : false;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="p-8">
        <h2
          className={`font-medievalsharp text-3xl ${
            type === "victory" ? "text-primary" : "text-red-600"
          } text-center mb-6`}
        >
          {type === "victory" ? "Victory!" : "Defeat!"}
        </h2>

        {type === "victory" && rewards && (
          <div className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="text-amber-800 font-bold">Rewards:</div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-amber-700">Gold</span>
                <span className="font-bold text-amber-900">
                  +{rewards.gold}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-700">Experience</span>
                <span className="font-bold text-amber-900">
                  +{rewards.experience}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-amber-700">Floor Completed</span>
                <span className="font-bold text-amber-900">
                  {rewards.floor}
                </span>
              </div>
            </div>
          </div>
        )}

        {type === "defeat" && (
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-800 text-center font-bold mb-2">
                Your character has fallen in battle
              </p>
              <p className="text-red-700 text-center text-sm">
                You can revive this character using crystals, or create a new
                one.
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-purple-800 font-bold mb-2">
                  Revive Cost: {crystalCost} Crystals
                </p>
                <p className="text-purple-600 text-sm">
                  Your Crystals: {userCrystals}
                </p>
              </div>

              <button
                onClick={onRevive}
                disabled={!canAffordRevive}
                className={`w-full mt-4 px-4 py-2 rounded-lg font-medievalsharp text-white transition-all duration-200
                  ${
                    canAffordRevive
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                {canAffordRevive ? "Revive Character" : "Not Enough Crystals"}
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-center text-sm">
                Or create a new character to continue your adventure.
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            if (type === "victory" && onNextFloor) {
              onNextFloor();
            } else {
              router.push("/dashboard");
            }
            onClose();
          }}
          className={`w-full mt-6 px-6 py-3 ${
            type === "victory"
              ? "bg-primary hover:bg-primary-dark"
              : "bg-red-600 hover:bg-red-700"
          } text-white rounded-lg font-medievalsharp text-lg shadow-lg transition-all duration-200 hover:shadow-xl`}
        >
          {type === "victory"
            ? "Continue to Next Floor"
            : "Return to Dashboard"}
        </button>
      </div>
    </Modal>
  );
}
