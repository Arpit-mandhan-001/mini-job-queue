import React from 'react';

interface StatusCardProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  colorClass?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  label,
  count,
  isActive,
  onClick,
  colorClass = 'text-slate-dark',
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border text-left transition-all w-full bg-surface-card ${
        isActive
          ? 'border-brand-primary ring-1 ring-brand-primary shadow-sm'
          : 'border-surface-border hover:border-slate-300'
      }`}
    >
      <div className="text-xs font-medium text-slate-subtle uppercase tracking-wider">
        {label}
      </div>
      <div className={`text-2xl font-bold mt-1 ${colorClass}`}>{count}</div>
    </button>
  );
};
