import { shuffle, type RandomSource } from "./random.ts";

export const RoomType = {
  BATTLE: "BATTLE",
  REST: "REST",
  SHOP: "SHOP",
  EVENT: "EVENT",
} as const;

export type RoomType = (typeof RoomType)[keyof typeof RoomType];

export const SELECTABLE_ROOMS: readonly RoomType[] = [
  RoomType.BATTLE,
  RoomType.REST,
  RoomType.SHOP,
  RoomType.EVENT,
];

export function getNextFloor(currentFloor: number): number {
  return Math.max(1, Math.floor(currentFloor || 1)) + 1;
}

export function isForcedRestFloor(floor: number): boolean {
  return Math.max(1, Math.floor(floor || 1)) % 5 === 0;
}

export function getRoomChoices(
  random: RandomSource = Math.random,
  count = 2
): RoomType[] {
  const safeCount = Math.max(1, Math.min(count, SELECTABLE_ROOMS.length));
  return shuffle(SELECTABLE_ROOMS, random).slice(0, safeCount);
}
