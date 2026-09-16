import React, { useState } from 'react';
import { Job, JobStatus } from '../types/job';
import { StatusBadge } from './StatusBadge';
import { Play, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onUpdateStatus: (id: string, status: JobStatus) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onUpdateStatus, onDelete }) => {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleStatusChange = async (targetStatus: JobStatus) => {
    try {
      setUpdating(true);
      await onUpdateStatus(job.id, targetStatus);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${job.title}"?`)) return;
    try {
      setDeleting(true);
      await onDelete(job.id);
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

  return (
    <div className="p-4 bg-surface-card rounded-lg border border-surface-border hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center space-x-3">
          <h3 className="text-sm font-semibold text-slate-dark">{job.title}</h3>
          <StatusBadge status={job.status} />
        </div>
        <div className="flex items-center space-x-4 text-xs text-slate-subtle">
          <span>Type: <strong className="font-medium text-slate-700">{job.type}</strong></span>
          <span>•</span>
          <span>Created: {formatDate(job.createdAt)}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 self-end sm:self-center">
        {/* Transition Actions */}
        {job.status === 'pending' && (
          <button
            disabled={updating || deleting}
            onClick={() => handleStatusChange('running')}
            className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium bg-brand-primary hover:bg-brand-primary/90 text-white rounded border border-transparent disabled:opacity-50 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Start Run</span>
          </button>
        )}

        {job.status === 'running' && (
          <>
            <button
              disabled={updating || deleting}
              onClick={() => handleStatusChange('completed')}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded border border-transparent disabled:opacity-50 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Complete</span>
            </button>
            <button
              disabled={updating || deleting}
              onClick={() => handleStatusChange('failed')}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded border border-transparent disabled:opacity-50 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Mark Failed</span>
            </button>
          </>
        )}

        {/* Delete Action */}
        <button
          disabled={updating || deleting}
          onClick={handleDelete}
          className="p-1.5 text-slate-subtle hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
          title="Delete Job"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
