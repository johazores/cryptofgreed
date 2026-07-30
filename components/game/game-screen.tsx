"use client";

import { useState } from "react";
import { toast } from "sonner";
import Combat from "./rooms/combat";
import Event from "./rooms/event";
import RestSite from "./rooms/rest-site";
import Shop from "./rooms/shop";
import RoomSelectionModal from "./room-selection-modal";
import { useCharacter } from "@/context/character-context";
import {
  getNextFloor,
  getRoomChoices,
  isForcedRestFloor,
  RoomType,
  type RoomType as RoomTypeValue,
} from "@/lib/game/room-manager";

interface GameScreenProps {
  onExit: () => void;
}

export default function GameScreen({ onExit }: GameScreenProps) {
  const { character, updateCharacter } = useCharacter();
  const [currentRoom, setCurrentRoom] = useState<RoomTypeValue>(RoomType.BATTLE);
  const [showRoomSelection, setShowRoomSelection] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<RoomTypeValue[]>([]);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const handleContinue = async () => {
    if (!character || isAdvancing) return;
    setIsAdvancing(true);

    try {
      const nextFloor = getNextFloor(character.floor);
      await updateCharacter(character.id, { floor: nextFloor });

      if (isForcedRestFloor(nextFloor)) {
        setCurrentRoom(RoomType.REST);
        setAvailableRooms([]);
        setShowRoomSelection(false);
        return;
      }

      setAvailableRooms(getRoomChoices());
      setShowRoomSelection(true);
    } catch (error) {
      console.error("Failed to advance the run:", error);
      toast.error("The next path could not be opened");
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleRoomSelection = (selectedRoom: RoomTypeValue) => {
    setShowRoomSelection(false);
    setCurrentRoom(selectedRoom);
  };

  if (!character) return null;

  const roomProps = {
    onContinue: handleContinue,
    isAdvancing,
  };

  return (
    <>
      {currentRoom === RoomType.BATTLE && (
        <Combat
          key={`battle-${character.id}-${character.floor}`}
          onExit={onExit}
          onComplete={handleContinue}
          isAdvancing={isAdvancing}
        />
      )}
      {currentRoom === RoomType.REST && (
        <RestSite key={`rest-${character.floor}`} {...roomProps} />
      )}
      {currentRoom === RoomType.SHOP && (
        <Shop key={`shop-${character.floor}`} {...roomProps} />
      )}
      {currentRoom === RoomType.EVENT && (
        <Event key={`event-${character.floor}`} {...roomProps} />
      )}

      <RoomSelectionModal
        isOpen={showRoomSelection}
        onClose={() => undefined}
        onSelectRoom={handleRoomSelection}
        availableRooms={availableRooms}
        currentFloor={character.floor || 1}
      />
    </>
  );
}
