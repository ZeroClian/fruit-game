import React from 'react';
import type { ScorePreviewResult, FruitContribution } from '../../engine/scoreCalculator';

interface ScorePreviewProps {
  preview: ScorePreviewResult | null;
}

const Breakdown: React.FC<{ items: FruitContribution[]; format?: (v: number) => string }> = ({
  items,
  format = v => String(v),
}) => {
  if (items.length === 0) return null;
  return (
    <span className="text-[var(--text-secondary)] text-xs">
      （{items.map(c => `${c.icon}${format(c.value)}`).join(' + ')}）
    </span>
  );
};

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
      <div className="space-y-1 text-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2">
          <span className="text-[var(--text-secondary)]">基础分</span>
          <div className="text-right">
            <span className="font-mono">{preview.baseScore}</span>
            <Breakdown items={preview.baseBreakdown} />
          </div>
        </div>
        {preview.addBreakdown.length > 0 && (
          <div className="flex flex-wrap items-baseline justify-between gap-x-2">
            <span className="text-[var(--text-secondary)]">加法倍率</span>
            <div className="text-right">
              <span className="font-mono">+{preview.addMultiplier}</span>
              <Breakdown items={preview.addBreakdown} format={v => `+${v}`} />
            </div>
          </div>
        )}
        {preview.subBreakdown.length > 0 && (
          <div className="flex flex-wrap items-baseline justify-between gap-x-2">
            <span className="text-[var(--text-secondary)]">减法倍率</span>
            <div className="text-right">
              <span className="font-mono">-{preview.subMultiplier}</span>
              <Breakdown items={preview.subBreakdown} format={v => `-${v}`} />
            </div>
          </div>
        )}
        {preview.mulBreakdown.length > 0 && (
          <div className="flex flex-wrap items-baseline justify-between gap-x-2">
            <span className="text-[var(--text-secondary)]">乘法倍率</span>
            <div className="text-right">
              <span className="font-mono">×{preview.mulMultiplier.toFixed(1)}</span>
              <Breakdown items={preview.mulBreakdown} format={v => `×${v}`} />
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-baseline justify-between gap-x-2">
          <span className="text-[var(--text-secondary)]">最终倍率</span>
          <span className="font-mono">×{preview.finalMultiplier.toFixed(1)}</span>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 border-t pt-1">
          <span className="text-[var(--text-secondary)] font-bold">预估总分</span>
          <span className="font-bold text-[var(--success)] font-mono">{preview.totalScore}</span>
        </div>
      </div>
    </div>
  );
};
