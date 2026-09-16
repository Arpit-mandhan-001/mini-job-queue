import React, { useState } from 'react';
import { CreateJobInput } from '../types/job';

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateJobInput) => Promise<any>;
}

export const JobForm: React.FC<JobFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('DATA_IMPORT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Job title is required');
      return;
    }
    if (!type.trim()) {
      setError('Job type is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({ title: title.trim(), type: type.trim() });
      setTitle('');
      setType('DATA_IMPORT');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-dark/40 backdrop-blur-none p-4">
      <div className="bg-surface-card rounded-lg border border-surface-border max-w-md w-full p-6 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <h2 className="text-base font-bold text-slate-dark">Create New Job</h2>
          <button
            onClick={onClose}
            className="text-slate-subtle hover:text-slate-dark text-lg font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-subtle mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Process Monthly Payroll"
              className="w-full px-3 py-2 border border-surface-border rounded-md text-sm text-slate-dark focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-subtle mb-1">
              Job Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-surface-border rounded-md text-sm text-slate-dark focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
            >
              <option value="DATA_IMPORT">DATA_IMPORT</option>
              <option value="REPORT_GENERATION">REPORT_GENERATION</option>
              <option value="EMAIL_DISPATCH">EMAIL_DISPATCH</option>
              <option value="IMAGE_PROCESSING">IMAGE_PROCESSING</option>
              <option value="DATABASE_CLEANUP">DATABASE_CLEANUP</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-subtle hover:text-slate-dark transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-medium bg-brand-primary hover:bg-brand-primary/90 text-white rounded shadow-sm disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
