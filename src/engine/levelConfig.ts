/**
 * 将大关卡和小关卡编号转换为1-24的关卡编号
 * 每个大关卡包含3个小关卡
 */
export function getLevelNumber(bigLevel: number, subLevel: number): number {
  return (bigLevel - 1) * 3 + subLevel;
}

/**
 * 从1-24的关卡编号获取大关卡编号
 */
export function getBigLevel(levelNumber: number): number {
  return Math.ceil(levelNumber / 3);
}

/**
 * 从1-24的关卡编号获取小关卡编号
 */
export function getSubLevel(levelNumber: number): number {
  return ((levelNumber - 1) % 3) + 1;
}

/**
 * 检查指定区域是否可用（未被占用）
 * usedCells: 16x25 的布尔矩阵，true 表示已被占用
 * row, col: 区域左上角坐标
 * size: 区域边长（如3表示3x3）
 */
export function isAreaAvailable(
  usedCells: boolean[][],
  row: number,
  col: number,
  size: number
): boolean {
  const rows = usedCells.length;
  const cols = usedCells[0]?.length ?? 0;

  // 边界检查
  if (row < 0 || col < 0 || row + size > rows || col + size > cols) {
    return false;
  }

  // 检查区域内是否所有格子都未被占用
  for (let r = row; r < row + size; r++) {
    for (let c = col; c < col + size; c++) {
      if (usedCells[r][c]) {
        return false;
      }
    }
  }

  return true;
}

/**
 * 从矩阵中提取 NxN 区域
 * matrix: 16x25 水果矩阵
 * row, col: 区域左上角坐标
 * size: 区域边长
 */
export function extractArea(
  matrix: string[][],
  row: number,
  col: number,
  size: number
): string[][] {
  const area: string[][] = [];
  for (let r = row; r < row + size; r++) {
    const rowArr: string[] = [];
    for (let c = col; c < col + size; c++) {
      rowArr.push(matrix[r]?.[c] ?? '');
    }
    area.push(rowArr);
  }
  return area;
}
