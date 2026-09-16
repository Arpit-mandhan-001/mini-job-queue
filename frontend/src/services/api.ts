import { Job, CreateJobInput, JobStatus } from '../types/job';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message;
      }
    } catch {
      // If parsing json fails, use default message
    }
    throw new ApiError(response.status, errorMessage);
  }

  if (response.status === 240 || response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const jobApi = {
  async getJobs(): Promise<Job[]> {
    const res = await fetch(`${API_BASE_URL}/jobs`);
    return handleResponse<Job[]>(res);
  },

  async createJob(input: CreateJobInput): Promise<Job> {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Job>(res);
  },

  async updateJobStatus(id: string, status: JobStatus): Promise<Job> {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return handleResponse<Job>(res);
  },

  async deleteJob(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(res);
  },
};
