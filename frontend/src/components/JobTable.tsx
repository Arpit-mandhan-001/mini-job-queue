import React from 'react';
import { Job, JobStatus } from '../types/job';
import { JobRow } from './JobRow';

interface JobTableProps {
  jobs: Job[];
  onUpdateStatus?: (id: string, status: JobStatus) => Promise<any>;
  onDelete?: (id: string) => Promise<any>;
}

export const JobTable: React.FC<JobTableProps> = ({
  jobs,
  onUpdateStatus,
  onDelete,
}) => {
  if (jobs.length === 0) {
    return (
      <div className="p-12 text-center bg-surface-card rounded-lg border border-surface-border shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <svg
            className="w-6 h-6 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-dark">No jobs found</h3>
        <p className="text-xs text-slate-subtle mt-1">
          There are no jobs matching the selected criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-card rounded-lg border border-surface-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-surface-border text-xs font-semibold text-slate-subtle uppercase tracking-wider">
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {jobs.map((job) => (
              <JobRow
                key={job.id}
                job={job}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
