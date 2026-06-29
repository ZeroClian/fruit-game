export const FruitType = {
  APPLE: 'apple',
  BANANA: 'banana',
  CHERRY: 'cherry',
  GRAPE: 'grape',
  ORANGE: 'orange',
  WATERMELON: 'watermelon',
  KIWI: 'kiwi',
  LEMON: 'lemon',
  STRAWBERRY: 'strawberry',
  PEACH: 'peach',
  POISON: 'poison',
} as const;

export type FruitType = (typeof FruitType)[keyof typeof FruitType];

export const FruitEffectType = {
  SCORE_ADD: 'score_add',
  MULTIPLIER_ADD: 'multiplier_add',
  MULTIPLIER_MUL: 'multiplier_mul',
  MULTIPLIER_SUB: 'multiplier_sub',
  RANDOM: 'random',
  DOUBLE: 'double',
  POISON: 'poison',
} as const;

export type FruitEffectType = (typeof FruitEffectType)[keyof typeof FruitEffectType];

export interface FruitConfig {
  type: FruitType;
  name: string;
  icon: string;
  effectType: FruitEffectType;
  baseValue: number;
  color: string;
  unlockLevel?: number;
}
