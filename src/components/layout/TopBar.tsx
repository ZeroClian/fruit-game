import React from 'react';

interface TopBarProps {
  title?: string;
  levelInfo?: string;
  coins?: number;
  lives?: number;
  onBack?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ title, levelInfo, coins, lives, onBack }) => (
  <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-card)] shadow-sm">
    <div className="flex items-center gap-2">
      {onBack && (
        <button onClick={onBack} className="text-[var(--text-primary)] cursor-pointer active:scale-90 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        </button>
      )}
      <span className="font-bold text-[var(--text-primary)]">{title || '🍎 水果小丑牌'}</span>
    </div>
    {levelInfo && <div className="text-sm text-[var(--text-secondary)]">{levelInfo}</div>}
    <div className="flex items-center gap-3">
      {coins !== undefined && <span className="text-[var(--accent-dark)] font-bold">🪙 {coins}</span>}
      {lives !== undefined && <span className="text-[var(--danger)] font-bold">{'❤️'.repeat(lives)}</span>}
    </div>
  </div>
);
