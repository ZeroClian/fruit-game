import React from 'react';

interface BottomBarProps {
  children: React.ReactNode;
}

export const BottomBar: React.FC<BottomBarProps> = ({ children }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-[var(--bg-card)] shadow-[0_-2px_10px_rgba(0,0,0,0.1)] px-4 py-3 flex items-center justify-center gap-4 z-40">
    {children}
  </div>
);
