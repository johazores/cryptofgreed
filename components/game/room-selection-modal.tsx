import Modal from "../modal";
import { LuSwords } from "react-icons/lu";
import { GiCampfire, GiShop } from "react-icons/gi";
import { MdOutlineQuestionMark } from "react-icons/md";

export enum RoomType {
  BATTLE = "BATTLE",
  REST = "REST",
  SHOP = "SHOP",
  EVENT = "EVENT",
}

interface RoomOption {
  type: RoomType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface RoomSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoom: (roomType: RoomType) => void;
  availableRooms: RoomType[];
  currentFloor?: number; // Add this prop
}

export default function RoomSelectionModal({
  isOpen,
  onClose,
  onSelectRoom,
  availableRooms,
  currentFloor = 1, // Default to floor 1 if not provided
}: RoomSelectionModalProps) {
  const roomOptions: Record<RoomType, RoomOption> = {
    [RoomType.BATTLE]: {
      type: RoomType.BATTLE,
      title: "Battle",
      description: "Face an enemy in combat",
      icon: <LuSwords className="w-8 h-8" />,
    },
    [RoomType.REST]: {
      type: RoomType.REST,
      title: "Rest Site",
      description: "Heal and prepare for future challenges",
      icon: <GiCampfire className="w-8 h-8" />,
    },
    [RoomType.SHOP]: {
      type: RoomType.SHOP,
      title: "Shop",
      description: "Buy items and upgrades",
      icon: <GiShop className="w-8 h-8" />,
    },
    [RoomType.EVENT]: {
      type: RoomType.EVENT,
      title: "Mystery Event",
      description: "Encounter a random event",
      icon: <MdOutlineQuestionMark className="w-8 h-8" />,
    },
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-medievalsharp mb-4 text-center">
          Floor {currentFloor} - Choose Your Path
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableRooms.map((roomType) => {
            const room = roomOptions[roomType];
            return (
              <button
                key={roomType}
                onClick={() => onSelectRoom(roomType)}
                className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all duration-200"
              >
                <div className="text-primary mb-2">{room.icon}</div>
                <h3 className="font-medievalsharp text-lg mb-1">
                  {room.title}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {room.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
