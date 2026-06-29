import { FruitType } from '../types/fruit';
import type { LevelConfig } from '../types/level';
import { getRestrictionsForLevel } from './restrictions';

/**
 * ============================================================================
 *  关卡目标分数配置
 * ============================================================================
 *  修改下方 TARGET_SCORES 数组即可调整每关难度。
 *  数组共 24 个元素，分别对应关卡 #1 ~ #24（8 大关 × 3 小关）。
 *  数值越大难度越高，数值越小难度越低。
 *
 *  当前数值适配：10×10 矩阵、香蕉 +3、车厘子 ×1.1 的低倍率体系。
 *  如需调整，直接修改下方数值即可，无需改动其他文件。
 * ============================================================================
 */
const TARGET_SCORES = [
  300, 450, 900, 600, 900, 1800, 960, 1440, 2880, 2200,
  3000, 4000, 5500, 7500, 10000, 13500, 18000, 24000, 32000, 42000,
  56000, 74000, 96000, 400000,
];

const AVAILABLE_FRUITS_BY_BIG_LEVEL: Record<number, FruitType[]> = {
  1: [FruitType.APPLE, FruitType.BANANA, FruitType.CHERRY],
  2: [FruitType.APPLE, FruitType.BANANA, FruitType.CHERRY, FruitType.GRAPE],
  3: [FruitType.APPLE, FruitType.BANANA, FruitType.CHERRY, FruitType.GRAPE, FruitType.ORANGE, FruitType.LEMON],
  4: [FruitType.APPLE, FruitType.BANANA, FruitType.CHERRY, FruitType.GRAPE, FruitType.ORANGE, FruitType.LEMON, FruitType.KIWI],
  5: [FruitType.APPLE, FruitType.BANANA, FruitType.CHERRY, FruitType.GRAPE, FruitType.ORANGE, FruitType.LEMON, FruitType.KIWI, FruitType.WATERMELON],
  6: [FruitType.APPLE, FruitType.BANANA, FruitType.CHERRY, FruitType.GRAPE, FruitType.ORANGE, FruitType.LEMON, FruitType.KIWI, FruitType.WATERMELON, FruitType.STRAWBERRY, FruitType.PEACH],
  7: [FruitType.APPLE, FruitType.BANANA, FruitType.CHERRY, FruitType.GRAPE, FruitType.ORANGE, FruitType.LEMON, FruitType.KIWI, FruitType.WATERMELON, FruitType.STRAWBERRY, FruitType.PEACH],
  8: [FruitType.APPLE, FruitType.BANANA, FruitType.CHERRY, FruitType.GRAPE, FruitType.ORANGE, FruitType.LEMON, FruitType.KIWI, FruitType.WATERMELON, FruitType.STRAWBERRY, FruitType.PEACH],
};

// Probability distributions per big level
// Score type ~55%, multiplier type ~25%, special type ~20%
const PROBABILITIES_BY_BIG_LEVEL: Record<number, Record<string, number>> = {
  1: {
    apple: 0.55,
    banana: 0.20,
    cherry: 0.25,
  },
  2: {
    apple: 0.40,
    banana: 0.15,
    cherry: 0.20,
    grape: 0.25,
  },
  3: {
    apple: 0.30,
    banana: 0.10,
    cherry: 0.15,
    grape: 0.20,
    orange: 0.15,
    lemon: 0.10,
  },
  4: {
    apple: 0.25,
    banana: 0.08,
    cherry: 0.12,
    grape: 0.15,
    orange: 0.12,
    lemon: 0.08,
    kiwi: 0.20,
  },
  5: {
    apple: 0.20,
    banana: 0.07,
    cherry: 0.10,
    grape: 0.12,
    orange: 0.10,
    lemon: 0.06,
    kiwi: 0.15,
    watermelon: 0.20,
  },
  6: {
    apple: 0.15,
    banana: 0.05,
    cherry: 0.08,
    grape: 0.10,
    orange: 0.08,
    lemon: 0.05,
    kiwi: 0.10,
    watermelon: 0.15,
    strawberry: 0.12,
    peach: 0.12,
  },
  7: {
    apple: 0.12,
    banana: 0.05,
    cherry: 0.07,
    grape: 0.08,
    orange: 0.08,
    lemon: 0.05,
    kiwi: 0.08,
    watermelon: 0.12,
    strawberry: 0.15,
    peach: 0.20,
  },
  8: {
    apple: 0.10,
    banana: 0.04,
    cherry: 0.06,
    grape: 0.07,
    orange: 0.07,
    lemon: 0.04,
    kiwi: 0.07,
    watermelon: 0.10,
    strawberry: 0.18,
    peach: 0.27,
  },
};

function getBigLevel(levelNumber: number): number {
  return Math.ceil(levelNumber / 3);
}

function getSubLevel(levelNumber: number): number {
  return ((levelNumber - 1) % 3) + 1;
}

function getMaxSelections(bigLevel: number): number {
  if (bigLevel <= 2) return 3;
  if (bigLevel <= 4) return 4;
  return 5;
}

function buildLevelConfig(levelNumber: number): LevelConfig {
  const bigLevel = getBigLevel(levelNumber);
  const subLevel = getSubLevel(levelNumber);

  return {
    levelNumber,
    bigLevel,
    subLevel,
    targetScore: TARGET_SCORES[levelNumber - 1],
    availableFruits: AVAILABLE_FRUITS_BY_BIG_LEVEL[bigLevel] || AVAILABLE_FRUITS_BY_BIG_LEVEL[8],
    fruitProbabilities: PROBABILITIES_BY_BIG_LEVEL[bigLevel] || PROBABILITIES_BY_BIG_LEVEL[8],
    restrictions: getRestrictionsForLevel(bigLevel, subLevel),
    maxSelections: getMaxSelections(bigLevel),
  };
}

const ALL_LEVELS: LevelConfig[] = Array.from({ length: 24 }, (_, i) => buildLevelConfig(i + 1));

export function getLevelConfig(levelNumber: number): LevelConfig {
  if (levelNumber < 1 || levelNumber > 24) {
    throw new Error(`Invalid level number: ${levelNumber}. Must be between 1 and 24.`);
  }
  return ALL_LEVELS[levelNumber - 1];
}

export function getAllLevels(): LevelConfig[] {
  return ALL_LEVELS;
}
