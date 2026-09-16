import React, { useState } from 'react';
import { useJobs } from '../hooks/useJobs';
import { Header } from '../components/Header';
import { StatusCard } from '../components/StatusCard';
import { StatusFilter, FilterOption } from '../components/StatusFilter';
import { JobTable } from '../components/JobTable';
import { JobForm } from '../components/JobForm';
import { JobStatus } from '../types/job';

export const DashboardPage: React.FC = () => {
  const {
    jobs,
    loading,
    error,
    activeFilter,
    setActiveFilter,
    statusCounts,
    refetch,
    createJob,
    updateJobStatus,
    deleteJob,
    setError,
  } = useJobs();

  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col font-sans">
      {/* 1. Header */}
      <Header onOpenCreateModal={() => setIsFormOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* API Error Notification */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center justify-between text-red-800 text-xs font-medium">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="font-bold underline hover:text-red-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 2. Status Summary Section (Four Count Cards) */}
        <div>
          <h2 className="text-xs font-semibold text-slate-subtle uppercase tracking-wider mb-3">
            Status Summary
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatusCard
              label="Pending"
              count={statusCounts.pending}
              isActive={activeFilter === 'pending'}
              onClick={() => setActiveFilter('pending')}
              colorClass="text-amber-600"
            />
            <StatusCard
              label="Running"
              count={statusCounts.running}
              isActive={activeFilter === 'running'}
              onClick={() => setActiveFilter('running')}
              colorClass="text-brand-primary"
            />
            <StatusCard
              label="Completed"
              count={statusCounts.completed}
              isActive={activeFilter === 'completed'}
              onClick={() => setActiveFilter('completed')}
              colorClass="text-status-success"
            />
            <StatusCard
              label="Failed"
              count={statusCounts.failed}
              isActive={activeFilter === 'failed'}
              onClick={() => setActiveFilter('failed')}
              colorClass="text-status-error"
            />
          </div>
        </div>

        {/* 3. Filter Section & Jobs Table Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-surface-border">
          <div className="flex items-center space-x-3">
            <h2 className="text-sm font-bold text-slate-dark">Jobs Overview</h2>
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
              {jobs.length}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <StatusFilter
              activeFilter={activeFilter as FilterOption}
              onFilterChange={(filter) => setActiveFilter(filter)}
            />
            <button
              onClick={refetch}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium text-slate-subtle hover:text-slate-dark border border-surface-border rounded-md bg-surface-card hover:border-slate-300 transition-colors disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* 4. Jobs Section (JobTable / JobRow / Empty State) */}
        {loading && jobs.length === 0 ? (
          <div className="p-12 text-center bg-surface-card rounded-lg border border-surface-border">
            <p className="text-xs text-slate-subtle font-medium">Loading jobs...</p>
          </div>
        ) : (
          <JobTable
            jobs={jobs}
            onUpdateStatus={(id, status) => updateJobStatus(id, status as JobStatus)}
            onDelete={deleteJob}
          />
        )}
      </main>

      {/* 5. Create Job Form Modal */}
      <JobForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={createJob}
      />
    </div>
  );
};
