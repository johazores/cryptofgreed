import { Character } from "@/types/character";
import { GameState, GameManager } from "./game-state";
import { Enemy, EnemyManager } from "./enemy";
import { CombatManager } from "./combat-manager";

export enum RoomType {
  BATTLE = "BATTLE",
  REST = "REST",
  SHOP = "SHOP",
  EVENT = "EVENT",
}

interface RoomManagerResult {
  nextRoom: RoomType;
  gameState: GameState;
  enemies?: Enemy[];
  combatManager?: CombatManager;
}

export class RoomManager {
  static handleNextRoom(
    character: Character,
    currentFloor: number
  ): RoomManagerResult {
    const nextFloor = currentFloor + 1;

    // Special case: force rest site every 5 floors
    if (nextFloor % 5 === 0) {
      return {
        nextRoom: RoomType.REST,
        gameState: this.initializeGameState(character, nextFloor),
      };
    }

    // Determine next room type (weighted random)
    const roomWeights = {
      [RoomType.BATTLE]: 0.6,
      [RoomType.REST]: 0.15,
      [RoomType.SHOP]: 0.15,
      [RoomType.EVENT]: 0.1,
    };

    const random = Math.random();
    let cumulativeWeight = 0;
    let selectedRoom = RoomType.BATTLE;

    for (const [room, weight] of Object.entries(roomWeights)) {
      cumulativeWeight += weight;
      if (random <= cumulativeWeight) {
        selectedRoom = room as RoomType;
        break;
      }
    }

    const gameState = this.initializeGameState(character, nextFloor);

    if (selectedRoom === RoomType.BATTLE) {
      const enemy = EnemyManager.createEnemy(nextFloor);
      const combatManager = new CombatManager(gameState, [enemy]);
      return {
        nextRoom: selectedRoom,
        gameState,
        enemies: [enemy],
        combatManager,
      };
    }

    return {
      nextRoom: selectedRoom,
      gameState,
    };
  }

  private static initializeGameState(
    character: Character,
    floor: number
  ): GameState {
    const enhancedCharacter: Character = {
      ...character,
      equipment: character.equipment || [],
      powers: character.powers || [],
      block: 0,
      deck: [],
      hand: [],
      discardPile: [],
    };

    const gameManager = new GameManager(enhancedCharacter);
    const gameState = gameManager.getState();
    gameState.floor = floor;
    return gameState;
  }
}
