export type Intent = {
  type: "ATTACK" | "BLOCK" | "BUFF" | "DEBUFF";
  value: number;
  description: string;
};

export type Enemy = {
  id: string;
  name: string;
  currentHealth: number;
  maxHealth: number;
  block: number;
  intent: Intent;
  isElite: boolean;
  isBoss: boolean;
};

export class EnemyManager {
  static createEnemy(floor: number): Enemy {
    // Determine enemy type based on floor
    if (floor % 10 === 0) {
      // Every 10th floor is a boss
      return this.generateBoss(floor);
    } else if (floor % 5 === 0) {
      // Every 5th floor is an elite
      return this.generateElite(floor);
    } else {
      return this.generateNormal(floor);
    }
  }

  private static generateNormal(floor: number): Enemy {
    const baseHealth = 30 + floor * 2;
    const enemies: Enemy[] = [
      {
        id: "skeleton",
        name: "Skeleton Warrior",
        maxHealth: baseHealth,
        currentHealth: baseHealth,
        block: 0,
        intent: {
          type: "ATTACK",
          value: 6,
          description: "Intends to attack for 6 damage",
        },
        isElite: false,
        isBoss: false,
      },
    ];

    return enemies[Math.floor(Math.random() * enemies.length)];
  }

  private static generateElite(floor: number): Enemy {
    const baseHealth = 50 + floor * 3;
    return {
      id: "elite-skeleton",
      name: "Elite Skeleton Champion",
      maxHealth: baseHealth,
      currentHealth: baseHealth,
      block: 0,
      intent: {
        type: "ATTACK",
        value: 12,
        description: "Intends to attack for 12 damage",
      },
      isElite: true,
      isBoss: false,
    };
  }

  private static generateBoss(floor: number): Enemy {
    const baseHealth = 100 + floor * 4;
    return {
      id: "boss-lich",
      name: "Lich King",
      maxHealth: baseHealth,
      currentHealth: baseHealth,
      block: 0,
      intent: {
        type: "ATTACK",
        value: 20,
        description: "Intends to attack for 20 damage",
      },
      isElite: false,
      isBoss: true,
    };
  }
}
