import React from 'react';
import { Job, JobStatus } from '../types/job';
import { JobRow } from './JobRow';

interface JobTableProps {
  jobs: Job[];
  totalJobsCount: number;
  activeFilter: string;
  onUpdateStatus?: (id: string, status: JobStatus) => Promise<any>;
  onDelete?: (id: string) => Promise<any>;
}

export const JobTable: React.FC<JobTableProps> = ({
  jobs,
  totalJobsCount,
  activeFilter,
  onUpdateStatus,
  onDelete,
}) => {
  // Empty State A: No jobs in system at all
  if (totalJobsCount === 0) {
    return (
      <div className="p-12 text-center bg-surface-card rounded-lg border border-surface-border shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-dark">No jobs in queue</h3>
        <p className="text-xs text-slate-subtle mt-1">
          Your job queue is empty. Click "+ Create Job" above to submit your first job.
        </p>
      </div>
    );
  }

  // Empty State B: Jobs exist, but zero match active status filter
  if (jobs.length === 0) {
    return (
      <div className="p-12 text-center bg-surface-card rounded-lg border border-surface-border shadow-sm">
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-dark">No matching jobs</h3>
        <p className="text-xs text-slate-subtle mt-1">
          No jobs currently found under the <strong className="font-semibold text-slate-700">"{activeFilter}"</strong> filter.
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
