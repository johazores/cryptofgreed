import type { Card } from "../cards";
import type { Enemy } from "./enemy";
import type { GameState } from "./game-state";
import { shuffle, type RandomSource } from "./random.ts";

export type CombatState = {
  enemies: Enemy[];
  defeatedEnemies: Enemy[];
  turn: number;
  isPlayerTurn: boolean;
};

export class CombatManager {
  private readonly random: RandomSource;
  private gameState: GameState;
  private combatState: CombatState;

  constructor(
    gameState: GameState,
    enemies: Enemy[],
    random: RandomSource = Math.random
  ) {
    this.gameState = gameState;
    this.random = random;
    this.combatState = {
      enemies: enemies.map((enemy) => ({
        ...enemy,
        intent: { ...enemy.intent },
      })),
      defeatedEnemies: [],
      turn: 1,
      isPlayerTurn: true,
    };

    if (this.gameState.hand.length === 0) {
      this.drawNewHand();
    }
  }

  playCard(cardIndex: number, targetIndex = 0): boolean {
    if (!this.combatState.isPlayerTurn || this.gameState.status !== "PLAYING") {
      return false;
    }

    if (cardIndex < 0 || cardIndex >= this.gameState.hand.length) return false;

    const card = this.gameState.hand[cardIndex];
    if (card.energy > this.gameState.currentEnergy) return false;

    this.applyCardEffects(card, targetIndex);
    this.gameState.hand.splice(cardIndex, 1);
    this.gameState.discardPile.push(card);
    this.gameState.currentEnergy -= card.energy;

    return true;
  }

  private applyCardEffects(card: Card, targetIndex: number) {
    const effects = card.effects;

    if (effects.damage) {
      if (effects.special === "twice") {
        const target = this.combatState.enemies[targetIndex];
        if (target) {
          this.dealDamageToEnemy(target, effects.damage);
          this.dealDamageToEnemy(target, effects.damage);
        }
      } else if (effects.special === "aoe") {
        const targets = [...this.combatState.enemies];
        targets.forEach((target) => this.dealDamageToEnemy(target, effects.damage!));
      } else {
        const target = this.combatState.enemies[targetIndex];
        if (target) this.dealDamageToEnemy(target, effects.damage);
      }
    }

    if (effects.block) {
      this.gameState.block += effects.block;
    }

    if (effects.heal) {
      this.gameState.character.currentHealth = Math.min(
        this.gameState.character.currentHealth + effects.heal,
        this.gameState.character.maxHealth
      );
    }
  }

  private dealDamageToEnemy(enemy: Enemy, damage: number) {
    const targetIndex = this.combatState.enemies.indexOf(enemy);
    if (targetIndex < 0) return;

    const actualDamage = Math.max(0, damage - enemy.block);
    enemy.block = Math.max(0, enemy.block - damage);
    enemy.currentHealth = Math.max(0, enemy.currentHealth - actualDamage);

    if (enemy.currentHealth !== 0) return;

    this.combatState.defeatedEnemies.push({
      ...enemy,
      intent: { ...enemy.intent },
    });
    this.combatState.enemies.splice(targetIndex, 1);

    if (this.combatState.enemies.length === 0) {
      this.gameState.status = "VICTORY";
      this.combatState.isPlayerTurn = false;
    }
  }

  private dealDamageToPlayer(damage: number) {
    const actualDamage = Math.max(0, damage - this.gameState.block);
    this.gameState.block = Math.max(0, this.gameState.block - damage);
    this.gameState.character.currentHealth = Math.max(
      0,
      this.gameState.character.currentHealth - actualDamage
    );

    if (this.gameState.character.currentHealth === 0) {
      this.gameState.status = "DEFEAT";
      this.combatState.isPlayerTurn = false;
    }
  }

  endTurn(): boolean {
    if (!this.combatState.isPlayerTurn || this.gameState.status !== "PLAYING") {
      return false;
    }

    this.gameState.discardPile.push(...this.gameState.hand);
    this.gameState.hand = [];
    this.combatState.isPlayerTurn = false;

    this.processEnemyTurn();

    if (this.gameState.status === "PLAYING") {
      this.gameState.block = 0;
      this.gameState.currentEnergy = this.gameState.maxEnergy;
      this.drawNewHand();
      this.combatState.turn += 1;
      this.combatState.isPlayerTurn = true;
    }

    return true;
  }

  private processEnemyTurn() {
    for (const enemy of this.combatState.enemies) {
      if (this.gameState.status !== "PLAYING") return;

      if (enemy.intent.type === "ATTACK") {
        this.dealDamageToPlayer(enemy.intent.value);
      } else if (enemy.intent.type === "BLOCK") {
        enemy.block += enemy.intent.value;
      }
    }
  }

  private drawNewHand() {
    for (let index = 0; index < 5; index += 1) {
      if (this.gameState.drawPile.length === 0) {
        if (this.gameState.discardPile.length === 0) return;
        this.gameState.drawPile = shuffle(this.gameState.discardPile, this.random);
        this.gameState.discardPile = [];
      }

      const card = this.gameState.drawPile.pop();
      if (!card) return;
      this.gameState.hand.push(card);
    }
  }

  getCombatState(): CombatState {
    return {
      ...this.combatState,
      enemies: this.combatState.enemies.map((enemy) => ({
        ...enemy,
        intent: { ...enemy.intent },
      })),
      defeatedEnemies: this.combatState.defeatedEnemies.map((enemy) => ({
        ...enemy,
        intent: { ...enemy.intent },
      })),
    };
  }

  getState(): GameState {
    return {
      ...this.gameState,
      character: { ...this.gameState.character },
      deck: [...this.gameState.deck],
      hand: [...this.gameState.hand],
      discardPile: [...this.gameState.discardPile],
      drawPile: [...this.gameState.drawPile],
    };
  }
}
