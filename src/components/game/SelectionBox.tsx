import React from 'react';
import { Button } from '../common/Button';

interface SelectionBoxProps {
  selection: { row: number; col: number } | null;
  selectionSize: number;
  matrixSize: number;
  onConfirm: () => void;
  canConfirm: boolean;
}

export const SelectionBox: React.FC<SelectionBoxProps> = ({
  selection,
  selectionSize,
  matrixSize,
  onConfirm,
  canConfirm,
}) => {
  if (!selection) {
    return (
      <div className="text-center text-[var(--text-secondary)] py-2">
        点击矩阵中的格子来选择区域
      </div>
    );
  }

  const maxRow = matrixSize - selectionSize;
  const maxCol = matrixSize - selectionSize;
  const rowOverflow = selection.row > maxRow;
  const colOverflow = selection.col > maxCol;

  return (
    <div className="flex items-center justify-between gap-4 bg-[var(--bg-card)] rounded-2xl p-3 shadow-sm">
      <div className="text-sm text-[var(--text-secondary)]">
        选择区域: ({selection.row + 1},{selection.col + 1}) ~ ({selection.row + selectionSize},{selection.col + selectionSize})
        {selectionSize}×{selectionSize}
        {(rowOverflow || colOverflow) && (
          <span className="text-[var(--danger)] ml-2">⚠️ 部分超出边界</span>
        )}
      </div>
      <Button
        variant="accent"
        size="sm"
        onClick={onConfirm}
        disabled={!canConfirm}
      >
        确认选择
      </Button>
    </div>
  );
};
