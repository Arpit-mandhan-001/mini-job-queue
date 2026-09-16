import React, { useState } from 'react';
import { Job, JobStatus } from '../types/job';
import { StatusBadge } from './StatusBadge';

interface JobRowProps {
  job: Job;
  onUpdateStatus?: (id: string, status: JobStatus) => Promise<any>;
  onDelete?: (id: string) => Promise<any>;
}

export const JobRow: React.FC<JobRowProps> = ({ job, onUpdateStatus, onDelete }) => {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleStatusChange = async (targetStatus: JobStatus) => {
    if (!onUpdateStatus || updating || deleting) return;
    try {
      setUpdating(true);
      await onUpdateStatus(job.id, targetStatus);
    } catch {
      // Error handled upstream in useJobs hook
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || updating || deleting) return;
    if (!window.confirm(`Are you sure you want to delete job "${job.title}"?`)) return;
    try {
      setDeleting(true);
      await onDelete(job.id);
    } catch {
      // Error handled upstream in useJobs hook
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  const isDisabled = updating || deleting;

  return (
    <tr className="hover:bg-slate-50/80 transition-colors border-b border-surface-border last:border-b-0">
      <td className="px-6 py-4 text-sm font-semibold text-slate-dark">
        {job.title}
      </td>
      <td className="px-6 py-4 text-xs font-medium text-slate-subtle">
        <span className="px-2 py-1 bg-slate-100 rounded text-slate-700 font-mono">
          {job.type}
        </span>
      </td>
      <td className="px-6 py-4 text-xs">
        <StatusBadge status={job.status} />
      </td>
      <td className="px-6 py-4 text-xs text-slate-subtle">
        {formatDate(job.createdAt)}
      </td>
      <td className="px-6 py-4 text-xs text-right whitespace-nowrap space-x-2">
        {job.status === 'pending' && (
          <button
            disabled={isDisabled}
            onClick={() => handleStatusChange('running')}
            className="px-2.5 py-1 text-xs font-medium bg-brand-primary hover:bg-brand-primary/90 text-white rounded disabled:opacity-50 transition-colors inline-flex items-center space-x-1"
          >
            {updating && <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />}
            <span>{updating ? 'Updating...' : 'Start Job'}</span>
          </button>
        )}

        {job.status === 'running' && (
          <>
            <button
              disabled={isDisabled}
              onClick={() => handleStatusChange('completed')}
              className="px-2.5 py-1 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded disabled:opacity-50 transition-colors inline-flex items-center space-x-1"
            >
              {updating && <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />}
              <span>{updating ? 'Updating...' : 'Complete'}</span>
            </button>
            <button
              disabled={isDisabled}
              onClick={() => handleStatusChange('failed')}
              className="px-2.5 py-1 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50 transition-colors inline-flex items-center space-x-1"
            >
              {updating && <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />}
              <span>{updating ? 'Updating...' : 'Mark Failed'}</span>
            </button>
          </>
        )}

        <button
          disabled={isDisabled}
          onClick={handleDelete}
          className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 inline-flex items-center space-x-1"
        >
          {deleting && <span className="w-2.5 h-2.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-1" />}
          <span>{deleting ? 'Deleting...' : 'Delete'}</span>
        </button>
      </td>
    </tr>
  );
};
