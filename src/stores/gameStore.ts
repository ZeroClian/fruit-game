import { create } from 'zustand';
import { FruitType } from '../types/fruit';
import type { SelectedArea } from '../types/game';
import type { Restriction } from '../types/level';
import { generateMatrix, getMatrixSize, shuffleMatrix } from '../engine/matrixGenerator';
import { calculateScore } from '../engine/scoreCalculator';
import { settleCoins } from '../engine/coinCalculator';
import { saveGame, loadGame, getDefaultSaveData } from '../engine/saveManager';
import { getLevelConfig } from '../data/levels';

/** 额外目标类型 */
export interface ExtraGoal {
  description: string;
  fruitType: string;
  minCount: number;
}

interface GameStore {
  // Game state
  gameState: 'menu' | 'playing' | 'paused' | 'result' | 'shop' | 'gameover';
  currentLevel: number;
  currentBigLevel: number;
  currentSubLevel: number;

  // Matrix
  matrix: string[][];
  usedCells: boolean[][];
  selectedAreas: SelectedArea[];
  currentSelection: { row: number; col: number } | null;

  // Score
  targetScore: number;
  currentScores: number[];
  totalScore: number;

  // Selections
  maxSelections: number;
  remainingSelections: number;
  selectionSize: number;

  // Economy
  coins: number;
  lives: number;

  // Restrictions
  activeRestrictions: Restriction[];
  frozenCells: boolean[][];
  hiddenCells: boolean[][];
  blindMode: boolean;
  extraGoal: ExtraGoal | null;

  // Upgrades
  permanentUpgrades: Record<string, number>;
  unlockedFruits: string[];
  consumables: Record<string, number>;

  // Progress
  completedLevels: number[];
  highScores: Record<number, number>;

  // Timer for TIMER restriction
  selectionTimer: number | null;

  // Consumable flags
  shieldActive: boolean;
  precisionActive: boolean;

  // Level result
  levelWon: boolean | null;

  // Actions
  startLevel: (levelNumber: number) => void;
  moveSelection: (row: number, col: number) => void;
  confirmSelection: () => void;
  endLevel: (won: boolean) => void;
  purchaseUpgrade: (itemId: string, price: number) => void;
  addCoins: (amount: number) => void;
  useConsumable: (itemId: string) => void;
  resetGame: () => void;
  setGameState: (state: GameStore['gameState']) => void;
  nextLevel: () => void;
  retryLevel: () => void;
  rerollMatrix: () => void;
  revealHiddenCells: () => void;
}

const MATRIX_SIZE = getMatrixSize();

function createEmptyBooleanGrid(size: number): boolean[][] {
  return Array.from({ length: size }, () => Array(size).fill(false));
}

function createFrozenCells(restrictions: Restriction[]): boolean[][] {
  const grid = createEmptyBooleanGrid(MATRIX_SIZE);
  const hasFrozen = restrictions.some(r => r.id === 'FROZEN');
  if (!hasFrozen) return grid;

  const totalCells = MATRIX_SIZE * MATRIX_SIZE;
  const frozenCount = Math.floor(totalCells * 0.2);
  let placed = 0;
  while (placed < frozenCount) {
    const row = Math.floor(Math.random() * MATRIX_SIZE);
    const col = Math.floor(Math.random() * MATRIX_SIZE);
    if (!grid[row][col]) {
      grid[row][col] = true;
      placed++;
    }
  }
  return grid;
}

function createHiddenCells(restrictions: Restriction[]): boolean[][] {
  const grid = createEmptyBooleanGrid(MATRIX_SIZE);
  const hasHidden = restrictions.some(r => r.id === 'HIDDEN' || r.id === 'BLIND');
  if (!hasHidden) return grid;

  const isBlind = restrictions.some(r => r.id === 'BLIND');
  if (isBlind) {
    return Array.from({ length: MATRIX_SIZE }, () => Array(MATRIX_SIZE).fill(true));
  }

  const totalCells = MATRIX_SIZE * MATRIX_SIZE;
  const hiddenCount = Math.floor(totalCells * 0.3);
  let placed = 0;
  while (placed < hiddenCount) {
    const row = Math.floor(Math.random() * MATRIX_SIZE);
    const col = Math.floor(Math.random() * MATRIX_SIZE);
    if (!grid[row][col]) {
      grid[row][col] = true;
      placed++;
    }
  }
  return grid;
}

function getSelectionSize(restrictions: Restriction[]): number {
  if (restrictions.some(r => r.id === 'SHRINK')) return 2;
  return 3;
}

function getMaxSelectionsOverride(restrictions: Restriction[]): number | null {
  if (restrictions.some(r => r.id === 'ONE_CHANCE')) return 1;
  return null;
}

function isBlindMode(restrictions: Restriction[]): boolean {
  return restrictions.some(r => r.id === 'BLIND');
}

/**
 * 生成 EXTRA_GOAL 额外目标条件
 * 从当前关卡的可用水果中随机选择一种，要求在所有选择中至少选中该水果 N 个
 */
function generateExtraGoal(restrictions: Restriction[], availableFruits: string[]): ExtraGoal | null {
  const hasExtraGoal = restrictions.some(r => r.id === 'EXTRA_GOAL');
  if (!hasExtraGoal) return null;

  // 从非毒果的可用水果中选一个
  const candidates = availableFruits.filter(f => f !== FruitType.POISON);
  if (candidates.length === 0) return null;

  const chosenFruit = candidates[Math.floor(Math.random() * candidates.length)];
  const minCount = Math.floor(Math.random() * 2) + 2; // 2~3

  const fruitNames: Record<string, string> = {
    apple: '苹果', banana: '香蕉', cherry: '车厘子', grape: '葡萄',
    orange: '橙子', watermelon: '西瓜', kiwi: '猕猴桃', lemon: '柠檬',
    strawberry: '草莓', peach: '桃子',
  };

  return {
    description: `所有选择中至少包含 ${minCount} 个${fruitNames[chosenFruit] ?? chosenFruit}`,
    fruitType: chosenFruit,
    minCount,
  };
}

/**
 * 检查额外目标是否达成
 */
function checkExtraGoal(selectedAreas: SelectedArea[], extraGoal: ExtraGoal | null): boolean {
  if (!extraGoal) return true;

  let count = 0;
  for (const area of selectedAreas) {
    for (const row of area.fruits) {
      for (const fruit of row) {
        if (fruit === extraGoal.fruitType) {
          count++;
        }
      }
    }
  }
  return count >= extraGoal.minCount;
}

// Try to load saved data
const savedData = loadGame();
const defaults = getDefaultSaveData();
const initialCoins = savedData?.coins ?? defaults.coins;
const initialLives = savedData?.lives ?? defaults.lives;
const initialCurrentLevel = savedData?.currentLevel ?? defaults.currentLevel;
const initialPermanentUpgrades = savedData?.permanentUpgrades ?? defaults.permanentUpgrades;
const initialUnlockedFruits = savedData?.unlockedFruits ?? defaults.unlockedFruits;
const initialConsumables = savedData?.consumables ?? defaults.consumables;
const initialCompletedLevels = savedData?.completedLevels ?? defaults.completedLevels;
const initialHighScores = savedData?.highScores ?? defaults.highScores;

function doSave(state: GameStore) {
  saveGame({
    version: defaults.version,
    currentLevel: state.currentLevel,
    coins: state.coins,
    lives: state.lives,
    permanentUpgrades: state.permanentUpgrades,
    unlockedFruits: state.unlockedFruits,
    consumables: state.consumables,
    completedLevels: state.completedLevels,
    highScores: state.highScores,
    lastSaved: Date.now(),
  });
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  gameState: 'menu',
  currentLevel: initialCurrentLevel,
  currentBigLevel: 1,
  currentSubLevel: 1,

  matrix: [],
  usedCells: createEmptyBooleanGrid(MATRIX_SIZE),
  selectedAreas: [],
  currentSelection: null,

  targetScore: 0,
  currentScores: [],
  totalScore: 0,

  maxSelections: 3,
  remainingSelections: 3,
  selectionSize: 3,

  coins: initialCoins,
  lives: initialLives,

  activeRestrictions: [],
  frozenCells: createEmptyBooleanGrid(MATRIX_SIZE),
  hiddenCells: createEmptyBooleanGrid(MATRIX_SIZE),
  blindMode: false,
  extraGoal: null,

  permanentUpgrades: initialPermanentUpgrades,
  unlockedFruits: initialUnlockedFruits,
  consumables: initialConsumables,

  completedLevels: initialCompletedLevels,
  highScores: initialHighScores,

  selectionTimer: null,
  shieldActive: false,
  precisionActive: false,
  levelWon: null,

  startLevel: (levelNumber: number) => {
    const levelConfig = getLevelConfig(levelNumber);
    const matrix = generateMatrix(levelConfig);
    const restrictions = levelConfig.restrictions;
    const selectionSize = getSelectionSize(restrictions);
    const maxSelOverride = getMaxSelectionsOverride(restrictions);
    const maxSelections = maxSelOverride ?? levelConfig.maxSelections;
    const blind = isBlindMode(restrictions);
    const extraGoal = generateExtraGoal(restrictions, levelConfig.availableFruits);

    set({
      gameState: 'playing',
      currentLevel: levelNumber,
      currentBigLevel: levelConfig.bigLevel,
      currentSubLevel: levelConfig.subLevel,
      matrix,
      usedCells: createEmptyBooleanGrid(MATRIX_SIZE),
      selectedAreas: [],
      currentSelection: null,
      targetScore: levelConfig.targetScore,
      currentScores: [],
      totalScore: 0,
      maxSelections,
      remainingSelections: maxSelections,
      selectionSize,
      activeRestrictions: restrictions,
      frozenCells: createFrozenCells(restrictions),
      hiddenCells: createHiddenCells(restrictions),
      blindMode: blind,
      extraGoal,
      selectionTimer: null,
      shieldActive: false,
      precisionActive: false,
      levelWon: null,
    });
  },

  moveSelection: (row: number, col: number) => {
    const { usedCells, frozenCells } = get();
    if (row < 0 || row >= MATRIX_SIZE || col < 0 || col >= MATRIX_SIZE) return;
    if (usedCells[row]?.[col]) return;
    if (frozenCells[row]?.[col]) return;

    set({ currentSelection: { row, col } });
  },

  confirmSelection: () => {
    const {
      currentSelection,
      matrix,
      usedCells,
      selectedAreas,
      currentScores,
      remainingSelections,
      selectionSize,
      permanentUpgrades,
      activeRestrictions,
      totalScore,
      targetScore,
      shieldActive,
      precisionActive,
    } = get();

    if (!currentSelection || remainingSelections <= 0) return;

    const { row, col } = currentSelection;

    // Extract fruits in the selection area
    const fruits: string[][] = [];
    const newUsedCells = usedCells.map(r => [...r]);

    for (let dr = 0; dr < selectionSize; dr++) {
      const fruitRow: string[] = [];
      for (let dc = 0; dc < selectionSize; dc++) {
        const r = row + dr;
        const c = col + dc;
        if (r < MATRIX_SIZE && c < MATRIX_SIZE) {
          fruitRow.push(matrix[r][c]);
          newUsedCells[r][c] = true;
        } else {
          fruitRow.push('');
        }
      }
      fruits.push(fruitRow);
    }

    // Check if any cell in the selection is already used or frozen
    const { frozenCells } = get();
    let blocked = false;
    for (let dr = 0; dr < selectionSize; dr++) {
      for (let dc = 0; dc < selectionSize; dc++) {
        const r = row + dr;
        const c = col + dc;
        if (r < MATRIX_SIZE && c < MATRIX_SIZE) {
          if (usedCells[r][c] || frozenCells[r][c]) {
            blocked = true;
          }
        }
      }
    }
    if (blocked) return;

    // Shield: remove poison fruits from score calculation
    const hasPoison = fruits.some(row => row.some(f => f === FruitType.POISON));
    const fruitsForScore = (shieldActive && hasPoison)
      ? fruits.map(row => row.map(f => f === FruitType.POISON ? FruitType.APPLE : f))
      : fruits;

    const hasReverse = activeRestrictions.some(r => r.id === 'REVERSE');
    let score = calculateScore(fruitsForScore, permanentUpgrades, hasReverse);

    // Precision: double the score
    if (precisionActive) {
      score *= 2;
    }

    const newArea: SelectedArea = {
      row,
      col,
      fruits: fruits as FruitType[][],
      score,
      timestamp: Date.now(),
    };

    const newSelectedAreas = [...selectedAreas, newArea];
    const newCurrentScores = [...currentScores, score];
    const newTotalScore = totalScore + score;
    const newRemainingSelections = remainingSelections - 1;

    // SHUFFLE: 每次选择确认后，洗牌未使用的格子
    const hasShuffle = activeRestrictions.some(r => r.id === 'SHUFFLE');
    const newMatrix = hasShuffle ? shuffleMatrix(matrix, newUsedCells) : matrix;

    // Check if level is complete
    const won = newTotalScore >= targetScore;

    set({
      selectedAreas: newSelectedAreas,
      currentScores: newCurrentScores,
      totalScore: newTotalScore,
      remainingSelections: newRemainingSelections,
      usedCells: newUsedCells,
      currentSelection: null,
      matrix: newMatrix,
      shieldActive: shieldActive && !hasPoison ? true : false,
      precisionActive: false,
    });

    // Auto-end level if won or no more selections
    if (won) {
      get().endLevel(true);
    } else if (newRemainingSelections <= 0) {
      get().endLevel(false);
    }
  },

  endLevel: (won: boolean) => {
    const {
      currentLevel,
      remainingSelections,
      maxSelections,
      completedLevels,
      totalScore,
      coins,
      highScores,
      selectedAreas,
      extraGoal,
    } = get();

    if (won) {
      // 检查额外目标：即使分数达标，如果 EXTRA_GOAL 未完成也算失败
      const extraGoalMet = checkExtraGoal(selectedAreas, extraGoal);
      if (!extraGoalMet) {
        // 额外目标未达成，视为失败
        const newLives = get().lives - 1;
        if (newLives <= 0) {
          set({ lives: 0, gameState: 'gameover', levelWon: false });
        } else {
          set({ lives: newLives, gameState: 'result', levelWon: false });
        }
        doSave(get());
        return;
      }

      const isFirstClear = !completedLevels.includes(currentLevel);
      const isPerfectClear = remainingSelections === maxSelections;
      const result = settleCoins(coins, remainingSelections, isFirstClear, isPerfectClear);

      const newCompletedLevels = isFirstClear
        ? [...completedLevels, currentLevel]
        : completedLevels;

      const newHighScores = {
        ...highScores,
        [currentLevel]: Math.max(highScores[currentLevel] ?? 0, totalScore),
      };

      set({
        gameState: 'result',
        coins: result.totalCoins,
        completedLevels: newCompletedLevels,
        highScores: newHighScores,
        levelWon: true,
      });

      // Auto-save
      doSave(get());
    } else {
      const newLives = get().lives - 1;
      if (newLives <= 0) {
        set({ lives: 0, gameState: 'gameover', levelWon: false });
      } else {
        set({ lives: newLives, gameState: 'result', levelWon: false });
      }

      // Auto-save
      doSave(get());
    }
  },

  purchaseUpgrade: (itemId: string, price: number) => {
    const { coins, permanentUpgrades, unlockedFruits, consumables } = get();
    if (coins < price) return;

    const newCoins = coins - price;

    // Determine category based on item ID prefix
    if (itemId.endsWith('_boost') || itemId.endsWith('_luck')) {
      set({
        coins: newCoins,
        permanentUpgrades: {
          ...permanentUpgrades,
          [itemId]: (permanentUpgrades[itemId] ?? 0) + 1,
        },
      });
    } else if (itemId.startsWith('unlock_')) {
      const fruitName = itemId.replace('unlock_', '');
      if (!unlockedFruits.includes(fruitName)) {
        set({
          coins: newCoins,
          unlockedFruits: [...unlockedFruits, fruitName],
        });
      }
    } else {
      set({
        coins: newCoins,
        consumables: {
          ...consumables,
          [itemId]: (consumables[itemId] ?? 0) + 1,
        },
      });
    }

    // Auto-save after purchase
    doSave(get());
  },

  addCoins: (amount: number) => {
    set(state => ({ coins: state.coins + amount }));
  },

  useConsumable: (itemId: string) => {
    const { consumables, lives } = get();
    const count = consumables[itemId] ?? 0;
    if (count <= 0) return;

    const newConsumables = {
      ...consumables,
      [itemId]: count - 1,
    };

    switch (itemId) {
      case 'life_potion':
        set({ consumables: newConsumables, lives: lives + 1 });
        break;
      case 'shield_card':
        set({ consumables: newConsumables, shieldActive: true });
        break;
      case 'precision_card':
        set({ consumables: newConsumables, precisionActive: true });
        break;
      case 'reroll_card':
        get().rerollMatrix();
        set({ consumables: newConsumables });
        break;
      case 'xray_card':
        get().revealHiddenCells();
        set({ consumables: newConsumables });
        break;
      default:
        set({ consumables: newConsumables });
    }

    doSave(get());
  },

  rerollMatrix: () => {
    const { currentLevel, usedCells } = get();
    const levelConfig = getLevelConfig(currentLevel);
    const newMatrix = generateMatrix(levelConfig);
    // Keep used cells marked
    const finalMatrix = newMatrix.map((row, r) =>
      row.map((cell, c) => usedCells[r]?.[c] ? newMatrix[r][c] : cell)
    );
    set({ matrix: finalMatrix });
  },

  revealHiddenCells: () => {
    set({
      hiddenCells: createEmptyBooleanGrid(MATRIX_SIZE),
      blindMode: false,
    });
  },

  resetGame: () => {
    const defaults = getDefaultSaveData();
    set({
      gameState: 'menu',
      currentLevel: 1,
      currentBigLevel: 1,
      currentSubLevel: 1,
      matrix: [],
      usedCells: createEmptyBooleanGrid(MATRIX_SIZE),
      selectedAreas: [],
      currentSelection: null,
      targetScore: 0,
      currentScores: [],
      totalScore: 0,
      maxSelections: 3,
      remainingSelections: 3,
      selectionSize: 3,
      coins: defaults.coins,
      lives: defaults.lives,
      activeRestrictions: [],
      frozenCells: createEmptyBooleanGrid(MATRIX_SIZE),
      hiddenCells: createEmptyBooleanGrid(MATRIX_SIZE),
      blindMode: false,
      extraGoal: null,
      permanentUpgrades: {},
      unlockedFruits: [],
      consumables: {},
      completedLevels: [],
      highScores: {},
      selectionTimer: null,
      shieldActive: false,
      precisionActive: false,
      levelWon: null,
    });
  },

  setGameState: (state: GameStore['gameState']) => {
    set({ gameState: state });
  },

  nextLevel: () => {
    const { currentLevel } = get();
    const nextLevelNum = currentLevel + 1;
    if (nextLevelNum > 24) {
      set({ gameState: 'menu' });
      return;
    }
    set({ currentLevel: nextLevelNum });
  },

  retryLevel: () => {
    const { currentLevel } = get();
    get().startLevel(currentLevel);
  },
}));
