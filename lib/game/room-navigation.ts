import { Character } from "@/types/character";
import { RoomManager, RoomType } from "./room-manager";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function handleRoomNavigation(
  character: Character | null,
  router: AppRouterInstance
) {
  if (!character) return;

  const { nextRoom } = RoomManager.handleNextRoom(
    character,
    character.floor || 1
  );

  const roomRoutes: Record<RoomType, string> = {
    BATTLE: "",
    REST: "/rest",
    SHOP: "/shop",
    EVENT: "/event",
  };

  const route = `/dashboard/game/${character.id}${roomRoutes[nextRoom]}`;
  router.push(route);
}

export function handleContinueToNextRoom(
  character: Character | null,
  router: AppRouterInstance
) {
  if (!character) return;

  const { nextRoom } = RoomManager.handleNextRoom(
    character,
    character.floor || 1
  );

  switch (nextRoom) {
    case "BATTLE":
      router.push(`/dashboard/game/${character.id}`);
      break;
    case "REST":
      router.push(`/dashboard/game/${character.id}/rest`);
      break;
    case "SHOP":
      router.push(`/dashboard/game/${character.id}/shop`);
      break;
    case "EVENT":
      router.push(`/dashboard/game/${character.id}/event`);
      break;
  }
}
