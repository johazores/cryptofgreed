import { Character } from "@/types/character";
import Modal from "../modal";

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
}

export default function EquipmentModal({
  isOpen,
  onClose,
  character,
}: EquipmentModalProps) {
  // Add null checks for both arrays
  const equippedItems = character?.equipment || [];
  const powers = character?.powers || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medievalsharp text-gray-900">
            Equipment & Items
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Equipment Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medievalsharp text-gray-800 mb-3">
            Equipment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {equippedItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {item.slot}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-700">
                  {Object.entries(item.stats).map(([stat, value]) => (
                    <span key={stat} className="mr-3">
                      {`${stat}: +${value}`}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Powers Section */}
        <div>
          <h3 className="text-lg font-medievalsharp text-gray-800 mb-3">
            Powers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {powers.map((power) => (
              <div
                key={power.id}
                className="bg-purple-50 rounded-lg p-4 border border-purple-200"
              >
                <h4 className="font-medium text-purple-900">{power.name}</h4>
                <p className="text-sm text-purple-700">{power.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
