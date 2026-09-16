import { useState, useEffect, useCallback, useMemo } from 'react';
import { Job, JobStatus, CreateJobInput, StatusCounts } from '../types/job';
import { jobApi } from '../services/api';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<JobStatus | 'all'>('all');

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobApi.getJobs();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const createJob = async (input: CreateJobInput) => {
    try {
      setError(null);
      const newJob = await jobApi.createJob(input);
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
      const updatedJob = await jobApi.updateJobStatus(id, status);
      setJobs((prev) => prev.map((j) => (j.id === id ? updatedJob : j)));
      return updatedJob;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update job status';
      setError(msg);
      throw err;
    }
  };

  const deleteJob = async (id: string) => {
    try {
      setError(null);
      await jobApi.deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete job';
      setError(msg);
      throw err;
    }
  };

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

  const filteredJobs = useMemo(() => {
    if (activeFilter === 'all') return jobs;
    return jobs.filter((job) => job.status === activeFilter);
  }, [jobs, activeFilter]);

  return {
    jobs: filteredJobs,
    allJobsCount: jobs.length,
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
