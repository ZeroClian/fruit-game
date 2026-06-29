import React from 'react';
import { ProgressBar } from '../common/ProgressBar';

interface ScoreBoardProps {
  targetScore: number;
  totalScore: number;
  remainingSelections: number;
  maxSelections: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  targetScore,
  totalScore,
  remainingSelections,
  maxSelections,
}) => {
  const reached = totalScore >= targetScore;

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-4 shadow-sm space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-[var(--text-secondary)]">目标分数</span>
        <span className={`font-bold text-lg ${reached ? 'text-[var(--success)]' : 'text-[var(--text-primary)]'}`}>
          {totalScore} / {targetScore}
        </span>
      </div>
      <ProgressBar current={totalScore} target={targetScore} />
      <div className="flex justify-between items-center text-sm">
        <span className="text-[var(--text-secondary)]">剩余选择次数</span>
        <span className={`font-bold ${remainingSelections <= 1 ? 'text-[var(--danger)]' : 'text-[var(--text-primary)]'}`}>
          {remainingSelections} / {maxSelections}
        </span>
      </div>
    </div>
  );
};
