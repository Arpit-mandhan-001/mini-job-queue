import { useState, useEffect, useCallback, useMemo } from 'react';
import { Job, JobStatus, CreateJobRequest, StatusCounts } from '../types/job';
import { jobService } from '../services/jobService';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<JobStatus | 'all'>('all');

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getJobs();
      setJobs(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to connect to server. Please check backend API.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const createJob = async (input: CreateJobRequest) => {
    try {
      setError(null);
      const newJob = await jobService.createJob(input);
      setJobs((prev) => [newJob, ...prev]);
      return newJob;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create job';
      setError(msg);
      throw err;
    }
  };

  const updateJobStatus = async (id: string, status: JobStatus) => {
    try {
      setError(null);
      const updatedJob = await jobService.updateJobStatus(id, status);
      setJobs((prev) => prev.map((j) => (j.id === id ? updatedJob : j)));
      return updatedJob;
    } catch (err: any) {
      const isConflict = err?.status === 409 || err?.message?.includes('409');
      const isNotFound = err?.status === 404 || err?.message?.includes('404');

      let errorMsg = err instanceof Error ? err.message : 'Failed to update job status';
      if (isConflict) {
        errorMsg = 'This job was already updated by another process. Refreshing current state...';
      } else if (isNotFound) {
        errorMsg = 'Job not found. It may have been deleted.';
      }

      setError(errorMsg);
      // Auto-refresh state from backend on error/conflict to keep UI in sync
      await fetchJobs();
      throw err;
    }
  };

  const deleteJob = async (id: string) => {
    try {
      setError(null);
      await jobService.deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err: any) {
      const isNotFound = err?.status === 404 || err?.message?.includes('404');
      const errorMsg = isNotFound
        ? 'Job not found. It may have already been deleted.'
        : err instanceof Error
        ? err.message
        : 'Failed to delete job';

      setError(errorMsg);
      await fetchJobs();
      throw err;
    }
  };

  // Status counts across complete master array
  const statusCounts = useMemo<StatusCounts>(() => {
    const counts: StatusCounts = {
      all: jobs.length,
      pending: 0,
      running: 0,
      completed: 0,
      failed: 0,
    };
    jobs.forEach((job) => {
      if (counts[job.status] !== undefined) {
        counts[job.status]++;
      }
    });
    return counts;
  }, [jobs]);

  // Filtered jobs array based on active status filter
  const filteredJobs = useMemo(() => {
    if (activeFilter === 'all') return jobs;
    return jobs.filter((job) => job.status === activeFilter);
  }, [jobs, activeFilter]);

  return {
    jobs: filteredJobs,
    totalJobsCount: jobs.length,
    loading,
    error,
    activeFilter,
    setActiveFilter,
    statusCounts,
    refetch: fetchJobs,
    createJob,
    updateJobStatus,
    deleteJob,
    setError,
  };
}
