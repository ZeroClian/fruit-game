import { FruitEffectType } from '../types/fruit';
import { FRUIT_CONFIGS, BOOST_STEPS } from '../data/fruits';
import { getPureFruitType } from './matrixGenerator';

/**
 * 获取水果的强化步长
 */
export function getBoostStep(fruit: string): number {
  return BOOST_STEPS[fruit] ?? 0;
}

/**
 * 计算单个水果的增强值 = baseValue + boostStep * upgradeLevel
 */
function getEnhancedValue(fruit: string, upgrades: Record<string, number>): number {
  const config = FRUIT_CONFIGS[fruit];
  if (!config) return 0;

  const boostStep = getBoostStep(fruit);
  const upgradeLevel = upgrades[`${fruit}_boost`] ?? 0;
  return config.baseValue + boostStep * upgradeLevel;
}

/**
 * 计算3x3区域的分数（兼容 gameStore 调用签名）
 * @param fruits 选择区域的水果矩阵
 * @param upgrades 永久升级记录
 * @param reverseMultiplier 是否反转倍率（REVERSE 限制效果）
 */
export function calculateScore(
  fruits: string[][],
  upgrades: Record<string, number>,
  reverseMultiplier: boolean = false
): number {
  const result = calculatePreviewScore(fruits, upgrades, reverseMultiplier);
  return result.totalScore;
}

/**
 * 计算区域分数（旧接口兼容）
 */
export function calculateAreaScore(
  fruits: string[][],
  upgrades: Record<string, number>
): number {
  const result = calculatePreviewScore(fruits, upgrades);
  return result.totalScore;
}

export interface FruitContribution {
  icon: string;
  name: string;
  value: number;
}

export interface ScorePreviewResult {
  baseScore: number;
  addMultiplier: number;
  subMultiplier: number;
  mulMultiplier: number;
  finalMultiplier: number;
  totalScore: number;
  baseBreakdown: FruitContribution[];
  addBreakdown: FruitContribution[];
  mulBreakdown: FruitContribution[];
  subBreakdown: FruitContribution[];
}

/**
 * 计算分数并返回详细分解，用于预览显示
 *
 * REVERSE（倍率反转）效果：
 * - MULTIPLIER_ADD (+) 变为 MULTIPLIER_SUB (-)
 * - MULTIPLIER_SUB (-) 变为 MULTIPLIER_ADD (+)
 * - MULTIPLIER_MUL (×) 变为除法 (÷)，即取倒数
 * - baseScore 不受影响
 */
export function calculatePreviewScore(
  fruits: string[][],
  upgrades: Record<string, number>,
  reverseMultiplier: boolean = false
): ScorePreviewResult {
  let baseScore = 0;
  let addMultiplier = 0;
  let subMultiplier = 0;
  let mulMultiplier = 1;
  let hasPoison = false;
  let hasDouble = false;
  let hasRandom = false;

  // Track per-fruit contributions
  const baseMap = new Map<string, { icon: string; name: string; value: number }>();
  const addMap = new Map<string, { icon: string; name: string; value: number }>();
  const mulMap = new Map<string, { icon: string; name: string; value: number }>();
  const subMap = new Map<string, { icon: string; name: string; value: number }>();

  const addToMap = (
    map: Map<string, { icon: string; name: string; value: number }>,
    pureType: string,
    enhancedValue: number
  ) => {
    const config = FRUIT_CONFIGS[pureType];
    if (!config) return;
    const existing = map.get(pureType);
    if (existing) {
      existing.value += enhancedValue;
    } else {
      map.set(pureType, { icon: config.icon, name: config.name, value: enhancedValue });
    }
  };

  for (const row of fruits) {
    for (const cell of row) {
      const pureType = getPureFruitType(cell);
      const config = FRUIT_CONFIGS[pureType];
      if (!config) continue;

      const enhancedValue = getEnhancedValue(pureType, upgrades);

      let effectType = config.effectType;

      // REVERSE: 反转倍率效果类型
      if (reverseMultiplier) {
        if (effectType === FruitEffectType.MULTIPLIER_ADD) {
          effectType = FruitEffectType.MULTIPLIER_SUB;
        } else if (effectType === FruitEffectType.MULTIPLIER_SUB) {
          effectType = FruitEffectType.MULTIPLIER_ADD;
        }
        // MULTIPLIER_MUL 在反转时变为除法，在累乘阶段处理
      }

      switch (effectType) {
        case FruitEffectType.SCORE_ADD:
          baseScore += enhancedValue;
          addToMap(baseMap, pureType, enhancedValue);
          break;
        case FruitEffectType.MULTIPLIER_ADD:
          addMultiplier += enhancedValue;
          addToMap(addMap, pureType, enhancedValue);
          break;
        case FruitEffectType.MULTIPLIER_MUL:
          if (reverseMultiplier) {
            // 反转：乘法变除法，取倒数
            if (enhancedValue !== 0) {
              mulMultiplier /= enhancedValue;
            }
          } else {
            mulMultiplier *= enhancedValue;
          }
          addToMap(mulMap, pureType, enhancedValue);
          break;
        case FruitEffectType.MULTIPLIER_SUB:
          subMultiplier += enhancedValue;
          addToMap(subMap, pureType, enhancedValue);
          break;
        case FruitEffectType.POISON:
          hasPoison = true;
          break;
        case FruitEffectType.DOUBLE:
          hasDouble = true;
          break;
        case FruitEffectType.RANDOM:
          hasRandom = true;
          break;
      }
    }
  }

  // 毒果：分数归零
  if (hasPoison) {
    return {
      baseScore: 0,
      addMultiplier: 0,
      subMultiplier: 0,
      mulMultiplier: 0,
      finalMultiplier: 0,
      totalScore: 0,
      baseBreakdown: [],
      addBreakdown: [],
      mulBreakdown: [],
      subBreakdown: [],
    };
  }

  // 最终倍率 = (加法倍率 - 减法倍率) × 乘法倍率
  const finalMultiplier = (addMultiplier - subMultiplier) * mulMultiplier;

  // score = baseScore × finalMultiplier
  let score = baseScore * finalMultiplier;

  // DOUBLE 效果：分数翻倍
  if (hasDouble) {
    score *= 2;
  }

  // RANDOM 效果：50% 概率翻倍
  if (hasRandom && Math.random() < 0.5) {
    score *= 2;
  }

  return {
    baseScore,
    addMultiplier,
    subMultiplier,
    mulMultiplier,
    finalMultiplier,
    totalScore: Math.round(score),
    baseBreakdown: Array.from(baseMap.values()),
    addBreakdown: Array.from(addMap.values()),
    mulBreakdown: Array.from(mulMap.values()),
    subBreakdown: Array.from(subMap.values()),
  };
}
