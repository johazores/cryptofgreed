import Combat from "./rooms/combat";
import RestSite from "./rooms/rest-site";
import Shop from "./rooms/shop";
import Event from "./rooms/event";
import RoomSelectionModal from "./room-selection-modal";
import { useCharacter } from "@/context/character-context";
import { RoomType } from "@/lib/game/room-manager";
import { useState } from "react";

interface GameScreenProps {
  onExit: () => void;
}

export default function GameScreen({ onExit }: GameScreenProps) {
  const { character, updateCharacter } = useCharacter();
  const [currentRoom, setCurrentRoom] = useState<RoomType>(RoomType.BATTLE);
  const [showRoomSelection, setShowRoomSelection] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<RoomType[]>([]);

  const handleContinue = async () => {
    if (!character) return;

    try {
      const nextFloor = (character.floor || 1) + 1;
      await updateCharacter(character.id, { floor: nextFloor });

      if (nextFloor % 5 === 0) {
        setCurrentRoom(RoomType.REST);
        return;
      }

      const possibleRooms = [
        RoomType.BATTLE,
        RoomType.REST,
        RoomType.SHOP,
        RoomType.EVENT,
      ];
      const selectedRooms = [...possibleRooms]
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      setAvailableRooms(selectedRooms);
      setShowRoomSelection(true);
    } catch (error) {
      console.error("Failed to update floor:", error);
    }
  };

  const handleRoomSelection = (selectedRoom: RoomType) => {
    setShowRoomSelection(false);
    setCurrentRoom(selectedRoom);
  };

  if (!character) return null;

  const renderRoom = () => {
    switch (currentRoom) {
      case RoomType.BATTLE:
        return <Combat onExit={onExit} />;
      case RoomType.REST:
        return <RestSite onContinue={handleContinue} />;
      case RoomType.SHOP:
        return <Shop onContinue={handleContinue} />;
      case RoomType.EVENT:
        return <Event onContinue={handleContinue} />;
      default:
        return null;
    }
  };

  return (
    <>
      {renderRoom()}
      <RoomSelectionModal
        isOpen={showRoomSelection}
        onClose={() => setShowRoomSelection(false)}
        onSelectRoom={handleRoomSelection}
        availableRooms={availableRooms}
        currentFloor={character.floor || 1}
      />
    </>
  );
}
