import type { SaveData } from '../types/shop';

const SAVE_KEY = 'fruit-joker-save';
const SAVE_VERSION = '1.0.0';

/**
 * 获取默认存档数据（新游戏状态）
 */
export function getDefaultSaveData(): SaveData {
  return {
    version: SAVE_VERSION,
    currentLevel: 1,
    coins: 0,
    lives: 3,
    permanentUpgrades: {},
    unlockedFruits: ['apple', 'banana', 'cherry'],
    consumables: {},
    completedLevels: [],
    highScores: {},
    lastSaved: Date.now(),
  };
}

/**
 * 保存游戏数据到 localStorage
 */
export function saveGame(data: SaveData): void {
  try {
    const saveData: SaveData = {
      ...data,
      lastSaved: Date.now(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  } catch (e) {
    console.error('保存游戏数据失败:', e);
  }
}

/**
 * 从 localStorage 加载游戏数据
 */
export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw) as SaveData;

    // 版本兼容性检查
    if (!data.version) {
      return null;
    }

    return data;
  } catch (e) {
    console.error('加载游戏数据失败:', e);
    return null;
  }
}

/**
 * 检查是否存在存档数据
 */
export function hasSaveData(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * 删除存档数据
 */
export function deleteSaveData(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {
    console.error('删除存档数据失败:', e);
  }
}
