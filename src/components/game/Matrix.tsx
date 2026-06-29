import React from 'react';
import { FRUIT_CONFIGS } from '../../data/fruits';

interface MatrixProps {
  matrix: string[][];
  usedCells: boolean[][];
  frozenCells: boolean[][];
  hiddenCells: boolean[][];
  currentSelection: { row: number; col: number } | null;
  selectionSize: number;
  onCellClick: (row: number, col: number) => void;
  cellSize?: number;
}

export const Matrix: React.FC<MatrixProps> = ({
  matrix,
  usedCells,
  frozenCells,
  hiddenCells,
  currentSelection,
  selectionSize,
  onCellClick,
  cellSize = 56,
}) => {
  const cols = matrix[0]?.length ?? 0;
  const fontSize = Math.round(cellSize * 0.45);

  return (
    <div className="relative inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {matrix.map((row, rowIdx) =>
        row.map((cell, colIdx) => {
          const isUsed = usedCells[rowIdx]?.[colIdx];
          const isFrozen = frozenCells[rowIdx]?.[colIdx];
          const isHidden = hiddenCells[rowIdx]?.[colIdx];
          const isSelected =
            currentSelection &&
            rowIdx >= currentSelection.row &&
            rowIdx < currentSelection.row + selectionSize &&
            colIdx >= currentSelection.col &&
            colIdx < currentSelection.col + selectionSize;

          const config = FRUIT_CONFIGS[cell];
          const displayIcon = isHidden ? '❓' : (config?.icon ?? cell);

          return (
            <button
              key={`${rowIdx}-${colIdx}`}
              onClick={() => onCellClick(rowIdx, colIdx)}
              className={`
                flex items-center justify-center rounded-lg transition-all duration-150
                ${isUsed ? 'bg-gray-300 opacity-40 cursor-not-allowed' : ''}
                ${isFrozen ? 'bg-blue-100 cursor-not-allowed ring-2 ring-blue-300' : ''}
                ${!isUsed && !isFrozen ? 'bg-[var(--bg-card)] hover:bg-gray-100 cursor-pointer active:scale-95 shadow-sm' : ''}
                ${isSelected ? 'ring-3 ring-[var(--primary)] bg-[var(--primary-light)]/20 scale-105' : ''}
              `}
              style={{ width: cellSize, height: cellSize, fontSize }}
              disabled={isUsed || isFrozen}
            >
              <span className={isFrozen ? 'opacity-50' : ''}>{displayIcon}</span>
            </button>
          );
        })
      )}
    </div>
  );
};
