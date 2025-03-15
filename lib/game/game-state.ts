import { Character } from "@/types/character";
import { Card, getStarterDeck } from "@/lib/cards";
import { Enemy } from "./enemy";
import { FightingStyle } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ethers } from "ethers";
import { WalletService } from "@/lib/wallet";
import { decrypt } from "@/lib/encryption";

// Add these new types at the top
export type CombatState = {
  enemies: Enemy[];
  turn: number;
  isPlayerTurn: boolean;
};

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
  status: "PLAYING" | "VICTORY" | "DEFEAT";
  combatState?: CombatState;
};

export class GameManager {
  private state: GameState;

  constructor(character: Character) {
    // Get starter deck based on character's class
    const starterDeck = getStarterDeck(character.class as FightingStyle);

    this.state = {
      floor: 1,
      character,
      currentEnergy: character.energy,
      maxEnergy: character.energy,
      deck: starterDeck, // Use the starter deck instead of character.deck
      hand: [],
      discardPile: [],
      drawPile: [],
      block: 0,
      status: "PLAYING",
    };
    this.initializeGame();
  }

  private initializeGame() {
    this.state.drawPile = this.shuffleArray([...this.state.deck]);
    this.drawInitialHand();
  }

  private shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  drawCard(count: number = 1) {
    for (let i = 0; i < count; i++) {
      if (this.state.drawPile.length === 0) {
        this.reshuffleDiscardPile();
      }
      if (this.state.drawPile.length > 0) {
        const card = this.state.drawPile.pop()!;
        this.state.hand.push(card);
      }
    }
  }

  private drawInitialHand() {
    this.drawCard(5);
  }

  private reshuffleDiscardPile() {
    this.state.drawPile = this.shuffleArray([...this.state.discardPile]);
    this.state.discardPile = [];
  }

  playCard(cardIndex: number, targetIndex?: number) {
    if (cardIndex < 0 || cardIndex >= this.state.hand.length) return false;

    const card = this.state.hand[cardIndex];
    if (card.energy > this.state.currentEnergy) return false;

    // Apply card effects
    this.applyCardEffects(card, targetIndex);

    // Move card to discard pile
    this.state.hand.splice(cardIndex, 1);
    this.state.discardPile.push(card);
    this.state.currentEnergy -= card.energy;

    return true;
  }

  private applyCardEffects(card: Card, targetIndex?: number) {
    const effects = card.effects;

    if (effects.block) {
      this.state.block += effects.block;
    }

    if (effects.heal) {
      this.state.character.currentHealth = Math.min(
        this.state.character.currentHealth + effects.heal,
        this.state.character.maxHealth
      );
    }

    // Handle special effects based on card type and fighting style
    if (effects.special) {
      this.handleSpecialEffects(card, effects.special, targetIndex);
    }
  }

  private handleSpecialEffects(
    card: Card,
    special: string,
    targetIndex?: number
  ) {
    switch (special) {
      case "twice":
        // Apply damage effect twice
        break;
      case "aoe":
        // Apply damage to all enemies
        break;
      // Add more special effects as needed
    }
  }

  endTurn() {
    // Move hand to discard pile
    this.state.discardPile.push(...this.state.hand);
    this.state.hand = [];

    // Reset energy
    this.state.currentEnergy = this.state.maxEnergy;

    // Reset block
    this.state.block = 0;

    // Draw new hand
    this.drawInitialHand();
  }

  getState(): GameState {
    return { ...this.state };
  }
}

async function handleCharacterDeath(characterId: string) {
  try {
    // Start transaction
    await prisma.$transaction(async (tx) => {
      // Get character with equipment
      const character = await tx.character.findUnique({
        where: { id: characterId },
        include: { equipment: true },
      });

      if (!character) throw new Error("Character not found");

      // For each equipped NFT
      for (const item of character.equipment) {
        // Get the contract instance
        const walletService = new WalletService();
        const user = await tx.user.findUnique({
          where: { id: character.userId },
          select: { encryptedPrivateKey: true },
        });

        if (!user) throw new Error("User not found");

        const privateKey = await decrypt(user.encryptedPrivateKey);

        // Call burn function on NFT contract
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_EQUIPMENT_CONTRACT_ADDRESS as string,
          ["function burn(uint256 tokenId)"],
          new ethers.Wallet(privateKey, walletService.getProvider())
        );

        await contract.burn(item.nftId);

        // Delete equipment from database
        await tx.equipment.delete({
          where: { id: item.id },
        });
      }

      // Mark character as dead
      await tx.character.update({
        where: { id: characterId },
        data: { isDead: true },
      });
    });
  } catch (error) {
    console.error("Error handling character death:", error);
    throw error;
  }
}
