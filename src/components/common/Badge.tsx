import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  const classes = {
    default: 'bg-gray-200 text-gray-700',
    success: 'bg-[var(--success)] text-white',
    warning: 'bg-[var(--warning)] text-[var(--text-primary)]',
    danger: 'bg-[var(--danger)] text-white',
  };
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${classes[variant]}`}>{children}</span>;
};
