import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-[var(--bg-card)] rounded-2xl p-4 shadow-md ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`}>
    {children}
  </div>
);
