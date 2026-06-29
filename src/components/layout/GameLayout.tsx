import React from 'react';

interface GameLayoutProps {
  children: React.ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children }) => (
  <div className="min-h-screen bg-[var(--bg-main)] flex flex-col">
    {children}
  </div>
);
