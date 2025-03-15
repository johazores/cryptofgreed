interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "victory" | "defeat";
  rewards?: {
    gold: number;
    experience: number;
  };
}

export default function GameModal({
  isOpen,
  onClose,
  type,
  rewards,
}: GameModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-fadeIn">
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
              <div className="flex justify-between items-center mt-2">
                <span className="text-amber-700">Experience</span>
                <span className="font-bold text-amber-900">
                  +{rewards.experience}
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
                This character&apos;s journey has come to an end. Their story
                will be remembered in the halls of heroes.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p className="text-gray-600 text-center text-sm">
                You can create a new character to continue your adventure.
              </p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className={`w-full mt-6 px-6 py-3 ${
            type === "victory"
              ? "bg-primary hover:bg-primary-dark"
              : "bg-red-600 hover:bg-red-700"
          } text-white rounded-lg font-medievalsharp text-lg shadow-lg transition-all duration-200 hover:shadow-xl`}
        >
          {type === "victory" ? "Continue" : "Return to Character Selection"}
        </button>
      </div>
    </div>
  );
}
