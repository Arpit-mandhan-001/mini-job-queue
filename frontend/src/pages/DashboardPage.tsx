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
    totalJobsCount,
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
        {/* Error Notification Alert Banner */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center justify-between text-red-800 text-xs font-medium">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>{error}</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={refetch}
                className="px-2.5 py-1 text-xs bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition-colors shadow-sm"
              >
                Retry Request
              </button>
              <button
                onClick={() => setError(null)}
                className="font-bold underline text-slate-500 hover:text-slate-800"
              >
                Dismiss
              </button>
            </div>
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
              className="px-3 py-1.5 text-xs font-medium text-slate-subtle hover:text-slate-dark border border-surface-border rounded-md bg-surface-card hover:border-slate-300 transition-colors disabled:opacity-50 inline-flex items-center space-x-1"
            >
              {loading && <span className="w-3 h-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin mr-1" />}
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* 4. Jobs Section (Initial Loading Skeleton vs Job Table) */}
        {loading && totalJobsCount === 0 ? (
          <div className="bg-surface-card rounded-lg border border-surface-border p-8 space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse" />
            <div className="h-10 bg-slate-100 rounded animate-pulse" />
            <div className="h-10 bg-slate-100 rounded animate-pulse" />
            <div className="h-10 bg-slate-100 rounded animate-pulse" />
          </div>
        ) : (
          <JobTable
            jobs={jobs}
            totalJobsCount={totalJobsCount}
            activeFilter={activeFilter}
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
