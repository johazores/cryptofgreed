export const FIGHTING_STYLES = ["MELEE", "RANGE", "MAGIC"] as const;
export type FightingStyleValue = (typeof FIGHTING_STYLES)[number];

export const CHARACTER_NAME_MIN_LENGTH = 3;
export const CHARACTER_NAME_MAX_LENGTH = 24;

export function normalizeCharacterName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function isFightingStyle(value: unknown): value is FightingStyleValue {
  return typeof value === "string" && FIGHTING_STYLES.includes(value as FightingStyleValue);
}

export function getCharacterCreationError(
  name: string,
  fightingStyle: unknown
): string | null {
  const normalizedName = normalizeCharacterName(name);

  if (normalizedName.length < CHARACTER_NAME_MIN_LENGTH) {
    return `Character name must be at least ${CHARACTER_NAME_MIN_LENGTH} characters`;
  }

  if (normalizedName.length > CHARACTER_NAME_MAX_LENGTH) {
    return `Character name must be ${CHARACTER_NAME_MAX_LENGTH} characters or fewer`;
  }

  if (!/^[a-zA-Z0-9' -]+$/.test(normalizedName)) {
    return "Character name can only use letters, numbers, spaces, apostrophes, and hyphens";
  }

  if (!isFightingStyle(fightingStyle)) {
    return "Choose a valid fighting style";
  }

  return null;
}
