export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface Job {
  id: string;
  title: string;
  type: string;
  status: JobStatus;
  createdAt: string;
}

export interface CreateJobRequest {
  title: string;
  type: string;
}

export interface UpdateJobStatusRequest {
  status: JobStatus;
}

// Backward compatibility alias
export type CreateJobInput = CreateJobRequest;
export type UpdateJobStatusInput = UpdateJobStatusRequest;

export interface StatusCounts {
  all: number;
  pending: number;
  running: number;
  completed: number;
  failed: number;
}
