import type { Restriction } from '../types/level';

export const RESTRICTIONS: Restriction[] = [
  { id: 'HIDDEN', name: '水果迷雾', description: '随机隐藏30%的水果', icon: '🌫️', intensity: 1, minBigLevel: 2 },
  { id: 'DISABLE_APPLE', name: '苹果禁忌', description: '矩阵中不出现苹果', icon: '🚫', intensity: 1, minBigLevel: 2 },
  { id: 'DISABLE_CHERRY', name: '车厘子禁忌', description: '矩阵中不出现车厘子', icon: '🚫', intensity: 2, minBigLevel: 3 },
  { id: 'DISABLE_BANANA', name: '香蕉禁忌', description: '矩阵中不出现香蕉', icon: '🚫', intensity: 2, minBigLevel: 3 },
  { id: 'SHRINK', name: '缩小选择', description: '选择框缩小为2×2', icon: '📐', intensity: 2, minBigLevel: 3 },
  { id: 'TIMER', name: '时间压力', description: '每次选择限时15秒', icon: '⏱️', intensity: 2, minBigLevel: 4 },
  { id: 'FROZEN', name: '冰冻区域', description: '随机20%格子被冻结', icon: '🧊', intensity: 3, minBigLevel: 5 },
  { id: 'SHUFFLE', name: '水果洗牌', description: '每次选择后未选中区域重排', icon: '🔀', intensity: 3, minBigLevel: 5 },
  { id: 'REVERSE', name: '倍率反转', description: '所有倍率效果取反', icon: '🔄', intensity: 3, minBigLevel: 6 },
  { id: 'POISON', name: '毒果陷阱', description: '混入5%毒果', icon: '☠️', intensity: 3, minBigLevel: 6 },
  { id: 'BLIND', name: '全盲模式', description: '所有水果显示为❓', icon: '🙈', intensity: 4, minBigLevel: 7 },
  { id: 'EXTRA_GOAL', name: '额外目标', description: '需满足额外条件', icon: '🎯', intensity: 4, minBigLevel: 7 },
  { id: 'ONE_CHANCE', name: '一击必杀', description: '仅允许1次选择', icon: '💀', intensity: 5, minBigLevel: 8 },
];

export function getAvailableRestrictions(bigLevel: number): Restriction[] {
  return RESTRICTIONS.filter(r => r.minBigLevel <= bigLevel);
}

export function getRestrictionsForLevel(bigLevel: number, subLevel: number): Restriction[] {
  const pool = getAvailableRestrictions(bigLevel);
  if (subLevel === 2 && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    return [pool[idx]];
  }
  if (subLevel === 3 && pool.length >= 2) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
  }
  if (subLevel === 3 && pool.length === 1) {
    return [pool[0]];
  }
  return [];
}
