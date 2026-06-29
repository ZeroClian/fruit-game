import React from 'react';

interface TopBarProps {
  title?: string;
  levelInfo?: string;
  coins?: number;
  lives?: number;
}

export const TopBar: React.FC<TopBarProps> = ({ title, levelInfo, coins, lives }) => (
  <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-card)] shadow-sm">
    <div className="font-bold text-[var(--text-primary)]">{title || '🍎 水果小丑牌'}</div>
    {levelInfo && <div className="text-sm text-[var(--text-secondary)]">{levelInfo}</div>}
    <div className="flex items-center gap-3">
      {coins !== undefined && <span className="text-[var(--accent-dark)] font-bold">🪙 {coins}</span>}
      {lives !== undefined && <span className="text-[var(--danger)] font-bold">{'❤️'.repeat(lives)}</span>}
    </div>
  </div>
);
