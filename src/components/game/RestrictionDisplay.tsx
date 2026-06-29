import React from 'react';
import type { Restriction } from '../../types/level';

interface RestrictionDisplayProps {
  restrictions: Restriction[];
}

export const RestrictionDisplay: React.FC<RestrictionDisplayProps> = ({ restrictions }) => {
  if (restrictions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {restrictions.map(r => (
        <div
          key={r.id}
          className="flex items-center gap-1 bg-[var(--bg-card)] rounded-full px-3 py-1 shadow-sm text-sm"
        >
          <span>{r.icon}</span>
          <span className="font-medium text-[var(--text-primary)]">{r.name}</span>
          <span className="text-[var(--text-secondary)] text-xs">- {r.description}</span>
        </div>
      ))}
    </div>
  );
};
