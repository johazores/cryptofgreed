import { GameState } from "./game-state";
import { Enemy } from "./enemy";
import { Card } from "@/types/character";

export type CombatState = {
  enemies: Enemy[];
  turn: number;
  isPlayerTurn: boolean;
};

export class CombatManager {
  private gameState: GameState;
  private combatState: CombatState;

  constructor(gameState: GameState, enemies: Enemy[]) {
    this.gameState = gameState;
    this.combatState = {
      enemies,
      turn: 1,
      isPlayerTurn: true,
    };

    // Initialize combat state
    this.drawNewHand();
  }

  playCard(cardIndex: number, targetIndex: number): boolean {
    if (cardIndex < 0 || cardIndex >= this.gameState.hand.length) return false;

    const card = this.gameState.hand[cardIndex];
    if (card.energy > this.gameState.currentEnergy) return false;

    // Apply card effects
    this.applyCardEffects(card, targetIndex);

    // Move card to discard pile
    this.gameState.hand.splice(cardIndex, 1);
    this.gameState.discardPile.push(card);
    this.gameState.currentEnergy -= card.energy;

    return true;
  }

  private applyCardEffects(card: Card, targetIndex: number) {
    const effects = card.effects;

    if (effects.damage) {
      this.dealDamage("player", effects.damage, targetIndex);
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

    // Handle special effects
    if (effects.special) {
      switch (effects.special) {
        case "twice":
          if (effects.damage) {
            this.dealDamage("player", effects.damage, targetIndex);
          }
          break;
        case "aoe":
          if (effects.damage) {
            this.combatState.enemies.forEach((_, index) => {
              this.dealDamage("player", effects.damage!, index);
            });
          }
          break;
      }
    }
  }

  dealDamage(source: "player" | "enemy", damage: number, targetIndex: number) {
    if (source === "player") {
      const enemy = this.combatState.enemies[targetIndex];
      if (!enemy) return;

      const actualDamage = Math.max(0, damage - enemy.block);
      enemy.block = Math.max(0, enemy.block - damage);
      enemy.currentHealth -= actualDamage;

      if (enemy.currentHealth <= 0) {
        this.combatState.enemies = this.combatState.enemies.filter(
          (_, i) => i !== targetIndex
        );
        // Check for victory when all enemies are defeated
        if (this.combatState.enemies.length === 0) {
          this.gameState.status = "VICTORY";
        }
      }
    } else {
      const actualDamage = Math.max(0, damage - this.gameState.block);
      this.gameState.block = Math.max(0, this.gameState.block - damage);
      this.gameState.character.currentHealth -= actualDamage;

      // Check for defeat when character health reaches 0
      if (this.gameState.character.currentHealth <= 0) {
        this.gameState.character.currentHealth = 0; // Ensure health doesn't go negative
        this.gameState.status = "DEFEAT";
      }
    }
  }

  processEnemyTurn() {
    this.combatState.enemies.forEach((enemy) => {
      switch (enemy.intent.type) {
        case "ATTACK":
          this.dealDamage("enemy", enemy.intent.value, 0);
          break;
        case "BLOCK":
          enemy.block += enemy.intent.value;
          break;
        // Handle other intent types
      }
    });
  }

  isCombatOver(): boolean {
    return (
      this.combatState.enemies.length === 0 ||
      this.gameState.character.currentHealth <= 0
    );
  }

  getCombatState(): CombatState {
    return { ...this.combatState };
  }

  getState(): GameState {
    return { ...this.gameState };
  }

  endTurn() {
    // Move hand to discard pile
    this.gameState.discardPile.push(...this.gameState.hand);
    this.gameState.hand = [];

    // Reset energy
    this.gameState.currentEnergy = this.gameState.maxEnergy;

    // Reset block
    this.gameState.block = 0;

    // Process enemy actions if it's not game over
    if (!this.isCombatOver()) {
      this.processEnemyTurn();
    }

    // Draw new hand if combat is still ongoing
    if (!this.isCombatOver()) {
      this.drawNewHand();
    }
  }

  private drawNewHand() {
    for (let i = 0; i < 5; i++) {
      if (this.gameState.drawPile.length === 0) {
        // Shuffle discard pile into draw pile
        this.gameState.drawPile = [...this.gameState.discardPile].sort(
          () => Math.random() - 0.5
        );
        this.gameState.discardPile = [];
      }
      if (this.gameState.drawPile.length > 0) {
        const card = this.gameState.drawPile.pop()!;
        this.gameState.hand.push(card);
      }
    }
  }
}
