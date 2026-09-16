import React from 'react';
import { JobStatus } from '../types/job';

interface StatusBadgeProps {
  status: JobStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: Record<JobStatus, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    running: 'bg-teal-50 text-teal-700 border-teal-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
  };

  const labels: Record<JobStatus, string> = {
    pending: 'Pending',
    running: 'Running',
    completed: 'Completed',
    failed: 'Failed',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${styles[status]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === 'pending'
            ? 'bg-amber-500'
            : status === 'running'
            ? 'bg-brand-accent'
            : status === 'completed'
            ? 'bg-emerald-500'
            : 'bg-red-500'
        }`}
      />
      {labels[status]}
    </span>
  );
};
