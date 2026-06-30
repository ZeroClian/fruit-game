import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GameLayout } from '../components/layout/GameLayout';
import { TopBar } from '../components/layout/TopBar';
import { ScoreBoard } from '../components/game/ScoreBoard';
import { Matrix } from '../components/game/Matrix';
import { SelectionBox } from '../components/game/SelectionBox';
import { ScorePreview } from '../components/game/ScorePreview';
import { RestrictionDisplay } from '../components/game/RestrictionDisplay';
import { ResultPanel } from '../components/game/ResultPanel';
import { useGameStore } from '../stores/gameStore';
import { calculatePreviewScore } from '../engine/scoreCalculator';
import { getMatrixSize } from '../engine/matrixGenerator';
import { useResponsive } from '../hooks/useResponsive';

const MATRIX_SIZE = getMatrixSize();

export const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const levelParam = searchParams.get('level');
  const levelNumber = levelParam ? parseInt(levelParam, 10) : 1;
  const { cellSize } = useResponsive();

  const {
    gameState,
    currentLevel,
    currentBigLevel,
    currentSubLevel,
    matrix,
    usedCells,
    frozenCells,
    hiddenCells,
    currentSelection,
    selectionSize,
    targetScore,
    totalScore,
    maxSelections,
    remainingSelections,
    coins,
    lives,
    activeRestrictions,
    permanentUpgrades,
    levelWon,
    startLevel,
    moveSelection,
    confirmSelection,
    nextLevel,
    retryLevel,
  } = useGameStore();

  // Timer for TIMER restriction
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timerCount, setTimerCount] = React.useState(15);
  const hasTimerRestriction = activeRestrictions.some(r => r.id === 'TIMER');

  // Start level on mount or when level param changes
  useEffect(() => {
    if (levelNumber >= 1 && levelNumber <= 24) {
      startLevel(levelNumber);
    }
  }, [levelNumber, startLevel]);

  // Check if current selection can be confirmed
  const canConfirm = useMemo(() => {
    if (!currentSelection || remainingSelections <= 0) return false;

    const { row, col } = currentSelection;
    for (let dr = 0; dr < selectionSize; dr++) {
      for (let dc = 0; dc < selectionSize; dc++) {
        const r = row + dr;
        const c = col + dc;
        if (r < MATRIX_SIZE && c < MATRIX_SIZE) {
          if (usedCells[r][c] || frozenCells[r][c]) return false;
        }
      }
    }
    return true;
  }, [currentSelection, remainingSelections, selectionSize, usedCells, frozenCells]);

  const handleConfirm = useCallback(() => {
    if (!canConfirm) return;
    confirmSelection();
  }, [canConfirm, confirmSelection]);

  // Auto-confirm when timer hits 0 - use ref to avoid stale closure
  const confirmRef = useRef(handleConfirm);
  confirmRef.current = handleConfirm;

  useEffect(() => {
    if (hasTimerRestriction && timerCount === 0 && currentSelection && gameState === 'playing') {
      confirmRef.current();
    }
  }, [timerCount, hasTimerRestriction, currentSelection, gameState]);

  // Handle TIMER restriction countdown
  useEffect(() => {
    if (hasTimerRestriction && gameState === 'playing' && currentSelection) {
      setTimerCount(15);
      timerRef.current = setInterval(() => {
        setTimerCount(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [hasTimerRestriction, gameState, currentSelection]);

  // Calculate preview score for current selection
  const previewScore = useMemo(() => {
    if (!currentSelection || matrix.length === 0) return null;

    const { row, col } = currentSelection;
    const fruits: string[][] = [];

    for (let dr = 0; dr < selectionSize; dr++) {
      const fruitRow: string[] = [];
      for (let dc = 0; dc < selectionSize; dc++) {
        const r = row + dr;
        const c = col + dc;
        if (r < MATRIX_SIZE && c < MATRIX_SIZE) {
          fruitRow.push(matrix[r][c]);
        } else {
          fruitRow.push('');
        }
      }
      fruits.push(fruitRow);
    }

    return calculatePreviewScore(fruits, permanentUpgrades);
  }, [currentSelection, matrix, selectionSize, permanentUpgrades]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameState !== 'playing') return;

    // Clamp selection so the box stays within bounds
    const clampedRow = Math.min(row, MATRIX_SIZE - selectionSize);
    const clampedCol = Math.min(col, MATRIX_SIZE - selectionSize);
    moveSelection(Math.max(0, clampedRow), Math.max(0, clampedCol));
  }, [gameState, selectionSize, moveSelection]);

  const handleNext = useCallback(() => {
    nextLevel();
    const next = currentLevel + 1;
    if (next <= 24) {
      navigate(`/game?level=${next}`);
    } else {
      navigate('/levels');
    }
  }, [currentLevel, navigate, nextLevel]);

  const handleRetry = useCallback(() => {
    retryLevel();
  }, [retryLevel]);

  const handleBack = useCallback(() => {
    navigate('/levels');
  }, [navigate]);

  const isResult = gameState === 'result';
  const isGameOver = gameState === 'gameover';
  const won = levelWon === true;

  // Redirect to game over page
  useEffect(() => {
    if (isGameOver) {
      navigate('/gameover');
    }
  }, [isGameOver, navigate]);

  return (
    <GameLayout>
      <TopBar
        title={`第${currentBigLevel}-${currentSubLevel}关`}
        levelInfo={`关卡 ${currentLevel}/24`}
        coins={coins}
        lives={lives}
        onBack={handleBack}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Restriction display */}
        <RestrictionDisplay restrictions={activeRestrictions} />

        {/* Timer display */}
        {hasTimerRestriction && currentSelection && gameState === 'playing' && (
          <div className={`text-center font-bold text-lg ${timerCount <= 5 ? 'text-[var(--danger)] animate-pulse' : 'text-[var(--text-primary)]'}`}>
            ⏱️ {timerCount}s
          </div>
        )}

        {/* Score board */}
        <ScoreBoard
          targetScore={targetScore}
          totalScore={totalScore}
          remainingSelections={remainingSelections}
          maxSelections={maxSelections}
        />

        {/* Matrix */}
        {matrix.length > 0 && (
          <div className="flex justify-center">
            <Matrix
              matrix={matrix}
              usedCells={usedCells}
              frozenCells={frozenCells}
              hiddenCells={hiddenCells}
              currentSelection={currentSelection}
              selectionSize={selectionSize}
              onCellClick={handleCellClick}
              cellSize={cellSize}
            />
          </div>
        )}

        {/* Selection box with confirm */}
        {gameState === 'playing' && (
          <SelectionBox
            selection={currentSelection}
            selectionSize={selectionSize}
            matrixSize={MATRIX_SIZE}
            onConfirm={handleConfirm}
            canConfirm={canConfirm}
          />
        )}

        {/* Score preview */}
        {currentSelection && gameState === 'playing' && (
          <ScorePreview preview={previewScore} />
        )}
      </div>

      {/* Result panel overlay */}
      {isResult && (
        <ResultPanel
          won={won}
          totalScore={totalScore}
          targetScore={targetScore}
          currentLevel={currentLevel}
          coins={coins}
          lives={lives}
          onNext={handleNext}
          onRetry={handleRetry}
          onBack={handleBack}
        />
      )}
    </GameLayout>
  );
};
