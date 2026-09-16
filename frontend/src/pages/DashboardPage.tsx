import React, { useState } from 'react';
import { useJobs } from '../hooks/useJobs';
import { Header } from '../components/Header';
import { StatusCard } from '../components/StatusCard';
import { JobCard } from '../components/JobCard';
import { CreateJobModal } from '../components/CreateJobModal';
import { AlertCircle, RefreshCw, Inbox } from 'lucide-react';
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      <Header onOpenCreateModal={() => setIsModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Error Alert Banner */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-red-800 text-sm">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-status-error flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-semibold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Status Count Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <StatusCard
            label="All Jobs"
            count={statusCounts.all}
            isActive={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
          />
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

        {/* Action & Filter Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-semibold text-slate-dark">
              {activeFilter === 'all'
                ? 'All Jobs'
                : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Jobs`}
            </h2>
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium">
              {jobs.length}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={refetch}
              disabled={loading}
              className="p-2 text-slate-subtle hover:text-slate-dark border border-surface-border rounded-md bg-surface-card hover:border-slate-300 transition-colors disabled:opacity-50"
              title="Refresh Jobs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Job List / Loading / Empty States */}
        {loading && jobs.length === 0 ? (
          <div className="p-12 text-center bg-surface-card rounded-lg border border-surface-border">
            <RefreshCw className="w-6 h-6 text-brand-primary animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-subtle">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center bg-surface-card rounded-lg border border-surface-border">
            <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-slate-dark">No jobs found</h3>
            <p className="text-xs text-slate-subtle mt-1">
              {activeFilter === 'all'
                ? 'Get started by creating a new job.'
                : `No jobs currently in "${activeFilter}" status.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onUpdateStatus={(id, status) => updateJobStatus(id, status as JobStatus)}
                onDelete={deleteJob}
              />
            ))}
          </div>
        )}
      </main>

      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createJob}
      />
    </div>
  );
};
