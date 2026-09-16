import React, { useState } from 'react';
import { CreateJobRequest } from '../types/job';

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateJobRequest) => Promise<any>;
}

export const JobForm: React.FC<JobFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('DATA_IMPORT');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setApiError(null);

    const trimmedTitle = title.trim();
    const trimmedType = type.trim();

    if (!trimmedTitle) {
      setValidationError('Job title is required and cannot be whitespace only.');
      return;
    }

    if (!trimmedType) {
      setValidationError('Job type is required and cannot be whitespace only.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({ title: trimmedTitle, type: trimmedType });
      // Reset form and close on success
      setTitle('');
      setType('DATA_IMPORT');
      onClose();
    } catch (err: any) {
      // Keep form open, display clear error message inside modal
      const message = err instanceof Error ? err.message : 'Failed to create job';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return; // Prevent closing while request is in flight
    setValidationError(null);
    setApiError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-dark/40 p-4">
      <div className="bg-surface-card rounded-lg border border-surface-border max-w-md w-full p-6 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <h2 className="text-base font-bold text-slate-dark">Create New Job</h2>
          <button
            type="button"
            disabled={loading}
            onClick={handleClose}
            className="text-slate-subtle hover:text-slate-dark text-lg font-bold transition-colors disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Inline Validation or API Error Alerts */}
          {(validationError || apiError) && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
              {validationError || apiError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-subtle mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              disabled={loading}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="e.g. Export Monthly Revenue Report"
              className="w-full px-3 py-2 border border-surface-border rounded-md text-sm text-slate-dark focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-subtle mb-1">
              Job Type <span className="text-red-500">*</span>
            </label>
            <select
              disabled={loading}
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                if (validationError) setValidationError(null);
              }}
              className="w-full px-3 py-2 border border-surface-border rounded-md text-sm text-slate-dark focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary disabled:bg-slate-100"
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
              disabled={loading}
              onClick={handleClose}
              className="px-4 py-2 text-xs font-medium text-slate-subtle hover:text-slate-dark transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-medium bg-brand-primary hover:bg-brand-primary/90 text-white rounded shadow-sm disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              {loading && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />}
              <span>{loading ? 'Creating...' : 'Create Job'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
