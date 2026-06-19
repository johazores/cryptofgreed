export type Card = {
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
};

type FightingStyle = "MELEE" | "RANGE" | "MAGIC";

export function getStarterDeck(fightingStyle: FightingStyle): Card[] {
  const basicStrikes = Array(4).fill({
    id: "strike",
    name: "Strike",
    description: "Deal 6 damage.",
    type: "ATTACK",
    energy: 1,
    effects: { damage: 6 },
  });

  const basicDefends = Array(4).fill({
    id: "defend",
    name: "Defend",
    description: "Gain 5 block.",
    type: "SKILL",
    energy: 1,
    effects: { block: 5 },
  });

  const classSpecificCards: Record<FightingStyle, Card[]> = {
    MELEE: [
      {
        id: "heavy-blow",
        name: "Heavy Blow",
        description: "Deal 10 damage.",
        type: "ATTACK",
        energy: 2,
        effects: { damage: 10 },
      },
    ],
    RANGE: [
      {
        id: "quick-strike",
        name: "Quick Strike",
        description: "Deal 4 damage twice.",
        type: "ATTACK",
        energy: 1,
        effects: { damage: 4, special: "twice" },
      },
    ],
    MAGIC: [
      {
        id: "fireball",
        name: "Fireball",
        description: "Deal 8 damage to all enemies.",
        type: "ATTACK",
        energy: 2,
        effects: { damage: 8, special: "aoe" },
      },
    ],
  };

  return [
    ...basicStrikes,
    ...basicDefends,
    ...classSpecificCards[fightingStyle],
  ];
}
