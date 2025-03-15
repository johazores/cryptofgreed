import { FightingStyle } from "@prisma/client";

export interface Character {
  experience: number;
  id: string;
  name: string;
  class: FightingStyle;
  currentHealth: number;
  maxHealth: number;
  energy: number;
  gold: number;
  equipment: any[];
  powers: any[];
  isDead: boolean;
  block: number;
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
  monstersSlain: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Card {
  id: string;
  name: string;
  description: string;
  type: "ATTACK" | "SKILL" | "POWER";
  energy: number;
  effects: {
    damage?: number;
    block?: number;
    heal?: number;
    special?: string;
  };
}
