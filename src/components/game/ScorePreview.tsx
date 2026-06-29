import React from 'react';

interface ScorePreviewProps {
  preview: {
    baseScore: number;
    addMultiplier: number;
    mulMultiplier: number;
    finalMultiplier: number;
    totalScore: number;
  } | null;
}

export const ScorePreview: React.FC<ScorePreviewProps> = ({ preview }) => {
  if (!preview) {
    return null;
  }

  if (preview.totalScore === 0) {
    return (
      <div className="bg-[var(--bg-card)] rounded-2xl p-3 shadow-sm text-center">
        <span className="text-[var(--danger)] font-bold">☠️ 含有毒果，分数为0！</span>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-3 shadow-sm">
      <div className="text-sm font-bold mb-1 text-[var(--text-primary)]">分数预览</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <span className="text-[var(--text-secondary)]">基础分</span>
        <span className="text-right font-mono">{preview.baseScore}</span>
        <span className="text-[var(--text-secondary)]">加法倍率</span>
        <span className="text-right font-mono">+{preview.addMultiplier}</span>
        <span className="text-[var(--text-secondary)]">乘法倍率</span>
        <span className="text-right font-mono">×{preview.mulMultiplier.toFixed(1)}</span>
        <span className="text-[var(--text-secondary)]">最终倍率</span>
        <span className="text-right font-mono">×{preview.finalMultiplier.toFixed(1)}</span>
        <span className="text-[var(--text-secondary)] font-bold">预估总分</span>
        <span className="text-right font-bold text-[var(--success)] font-mono">{preview.totalScore}</span>
      </div>
    </div>
  );
};
