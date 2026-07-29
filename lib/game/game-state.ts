"use client";

import type { Character } from "../../types/character";
import { getStarterDeck, type Card, type FightingStyle } from "../cards.ts";
import { shuffle, type RandomSource } from "./random.ts";

export type GameStatus = "PLAYING" | "VICTORY" | "DEFEAT";

export type GameState = {
  floor: number;
  character: Character;
  currentEnergy: number;
  maxEnergy: number;
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
  drawPile: Card[];
  block: number;
  status: GameStatus;
};

export class GameManager {
  private readonly random: RandomSource;
  private state: GameState;

  constructor(character: Character, random: RandomSource = Math.random) {
    this.random = random;
    const starterDeck = getStarterDeck(character.class as FightingStyle);

    this.state = {
      floor: Math.max(1, character.floor || 1),
      character: { ...character },
      currentEnergy: character.energy,
      maxEnergy: character.energy,
      deck: starterDeck,
      hand: [],
      discardPile: [],
      drawPile: shuffle(starterDeck, this.random),
      block: 0,
      status: "PLAYING",
    };

    this.drawCards(5);
  }

  private drawCards(count: number) {
    for (let index = 0; index < count; index += 1) {
      if (this.state.drawPile.length === 0 && this.state.discardPile.length > 0) {
        this.state.drawPile = shuffle(this.state.discardPile, this.random);
        this.state.discardPile = [];
      }

      const card = this.state.drawPile.pop();
      if (!card) return;
      this.state.hand.push(card);
    }
  }

  getState(): GameState {
    return {
      ...this.state,
      character: { ...this.state.character },
      deck: [...this.state.deck],
      hand: [...this.state.hand],
      discardPile: [...this.state.discardPile],
      drawPile: [...this.state.drawPile],
    };
  }
}
