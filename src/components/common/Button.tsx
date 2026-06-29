import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', onClick, disabled, children, className = '' }) => {
  const variantClasses = {
    primary: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]',
    secondary: 'bg-[var(--secondary)] text-white hover:opacity-90',
    danger: 'bg-[var(--danger)] text-white hover:opacity-90',
    accent: 'bg-[var(--accent)] text-[var(--text-primary)] hover:bg-[var(--accent-dark)]',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3 text-lg',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl font-bold transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'} ${className}`}
    >
      {children}
    </button>
  );
};
