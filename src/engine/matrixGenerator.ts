import { FruitType } from '../types/fruit';
import type { LevelConfig } from '../types/level';

const MATRIX_SIZE = 10;

/**
 * Get the pure fruit type from a cell value.
 * Strips any special markers (e.g. poison prefix) to get the base fruit type.
 */
export function getPureFruitType(cell: string): string {
  if (cell === FruitType.POISON) return FruitType.POISON;
  return cell;
}

/**
 * Generate a 10x10 matrix of fruits based on level config.
 */
export function generateMatrix(levelConfig: LevelConfig): string[][] {
  const { availableFruits, fruitProbabilities, restrictions } = levelConfig;

  // Build weighted pool from probabilities
  const pool: string[] = [];
  for (const fruit of availableFruits) {
    const prob = fruitProbabilities[fruit] || 0;
    const count = Math.round(prob * 100);
    for (let i = 0; i < count; i++) {
      pool.push(fruit);
    }
  }

  // Handle DISABLE restrictions
  const disabledFruits = new Set<string>();
  for (const r of restrictions) {
    if (r.id === 'DISABLE_APPLE') disabledFruits.add(FruitType.APPLE);
    if (r.id === 'DISABLE_CHERRY') disabledFruits.add(FruitType.CHERRY);
    if (r.id === 'DISABLE_BANANA') disabledFruits.add(FruitType.BANANA);
  }

  const filteredPool = pool.filter(f => !disabledFruits.has(f));
  const finalPool = filteredPool.length > 0 ? filteredPool : availableFruits.map(f => f);

  // Generate matrix
  const matrix: string[][] = [];
  for (let row = 0; row < MATRIX_SIZE; row++) {
    const rowArr: string[] = [];
    for (let col = 0; col < MATRIX_SIZE; col++) {
      const idx = Math.floor(Math.random() * finalPool.length);
      rowArr.push(finalPool[idx]);
    }
    matrix.push(rowArr);
  }

  // Handle POISON restriction: replace 5% of cells with poison
  const hasPoison = restrictions.some(r => r.id === 'POISON');
  if (hasPoison) {
    const totalCells = MATRIX_SIZE * MATRIX_SIZE;
    const poisonCount = Math.max(1, Math.floor(totalCells * 0.05));
    let placed = 0;
    while (placed < poisonCount) {
      const row = Math.floor(Math.random() * MATRIX_SIZE);
      const col = Math.floor(Math.random() * MATRIX_SIZE);
      if (matrix[row][col] !== FruitType.POISON) {
        matrix[row][col] = FruitType.POISON;
        placed++;
      }
    }
  }

  return matrix;
}

/**
 * Shuffle non-used cells in the matrix randomly.
 * Used by the SHUFFLE restriction after each selection.
 */
export function shuffleMatrix(
  matrix: string[][],
  usedCells: boolean[][]
): string[][] {
  const newMatrix = matrix.map(row => [...row]);

  // Collect all non-used cell values and positions
  const positions: { row: number; col: number }[] = [];
  const values: string[] = [];

  for (let row = 0; row < MATRIX_SIZE; row++) {
    for (let col = 0; col < MATRIX_SIZE; col++) {
      if (!usedCells[row][col]) {
        positions.push({ row, col });
        values.push(newMatrix[row][col]);
      }
    }
  }

  // Fisher-Yates shuffle on values
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }

  // Reassign shuffled values back to positions
  for (let i = 0; i < positions.length; i++) {
    newMatrix[positions[i].row][positions[i].col] = values[i];
  }

  return newMatrix;
}

export function getMatrixSize(): number {
  return MATRIX_SIZE;
}
