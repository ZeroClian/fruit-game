import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Button } from '../common/Button';

interface ResultPanelProps {
  won: boolean;
  totalScore: number;
  targetScore: number;
  currentLevel: number;
  coins: number;
  lives: number;
  onNext: () => void;
  onRetry: () => void;
  onBack: () => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  won,
  totalScore,
  targetScore,
  currentLevel,
  coins,
  lives,
  onNext,
  onRetry,
  onBack,
}) => {
  useEffect(() => {
    if (won) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [won]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[var(--bg-overlay)]" />
      <div className="relative bg-[var(--bg-card)] rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl text-center space-y-4">
        <div className="text-4xl">{won ? '🎉' : '😢'}</div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          {won ? '关卡通过！' : '挑战失败'}
        </h2>
        <div className="space-y-1 text-sm text-[var(--text-secondary)]">
          <p>关卡 {currentLevel}</p>
          <p>
            得分: <span className="font-bold text-[var(--text-primary)]">{totalScore}</span> / {targetScore}
          </p>
          <p>
            金币: <span className="font-bold text-[var(--accent-dark)]">🪙 {coins}</span>
          </p>
          {!won && (
            <p>
              剩余生命: <span className="font-bold text-[var(--danger)]">❤️ {lives}</span>
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {won && (
            <Button variant="primary" size="lg" onClick={onNext}>
              下一关
            </Button>
          )}
          {!won && (
            <Button variant="primary" size="lg" onClick={onRetry}>
              重试
            </Button>
          )}
          <Button variant="secondary" size="md" onClick={onBack}>
            返回关卡选择
          </Button>
        </div>
      </div>
    </div>
  );
};
