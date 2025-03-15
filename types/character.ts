export interface Character {
  id: string;
  name: string;
  class: string;
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
