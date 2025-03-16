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

    const nextFloor = (character.floor || 1) + 1;

    // Special case: force rest site every 5 floors
    if (nextFloor % 5 === 0) {
      setCurrentRoom(RoomType.REST);
      return;
    }

    // Generate 2 random unique room options
    const possibleRooms = [
      RoomType.BATTLE,
      RoomType.REST,
      RoomType.SHOP,
      RoomType.EVENT,
    ];
    const numberOfChoices = 2;
    const shuffledRooms = [...possibleRooms].sort(() => Math.random() - 0.5);
    const selectedRooms = shuffledRooms.slice(0, numberOfChoices);

    setAvailableRooms(selectedRooms);
    setShowRoomSelection(true);
  };

  const handleRoomSelection = (selectedRoom: RoomType) => {
    setShowRoomSelection(false);
    setCurrentRoom(selectedRoom);
  };

  if (!character) return null;

  const renderRoom = () => {
    switch (currentRoom) {
      case RoomType.BATTLE:
        return (
          <Combat
            onExit={onExit}
            onCombatEnd={() => {
              updateCharacter(character.id);
              handleContinue();
            }}
          />
        );
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
