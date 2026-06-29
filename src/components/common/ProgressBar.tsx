import React from 'react';

interface ProgressBarProps {
  current: number;
  target: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, target, className = '' }) => {
  const percentage = Math.min((current / target) * 100, 100);
  return (
    <div className={`w-full bg-gray-200 rounded-full h-4 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%`, backgroundColor: percentage >= 100 ? 'var(--success)' : 'var(--primary)' }}
      />
    </div>
  );
};
