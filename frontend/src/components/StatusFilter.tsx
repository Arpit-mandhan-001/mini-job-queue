import React from 'react';
import { JobStatus } from '../types/job';

export type FilterOption = 'all' | JobStatus;

interface StatusFilterProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const options: { id: FilterOption; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'running', label: 'Running' },
    { id: 'completed', label: 'Completed' },
    { id: 'failed', label: 'Failed' },
  ];

  return (
    <div className="inline-flex p-1 bg-slate-100 rounded-md border border-surface-border">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onFilterChange(opt.id)}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            activeFilter === opt.id
              ? 'bg-surface-card text-brand-primary font-semibold shadow-sm'
              : 'text-slate-subtle hover:text-slate-dark'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
