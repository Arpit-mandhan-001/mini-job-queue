import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, JobStatus } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const job = this.jobRepository.create({
      title: createJobDto.title,
      type: createJobDto.type,
      status: JobStatus.PENDING, // Initial status is strictly forced to pending
    });
    return await this.jobRepository.save(job);
  }

  async findAll(): Promise<Job[]> {
    return await this.jobRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, updateJobStatusDto: UpdateJobStatusDto): Promise<Job> {
    const { status: targetStatus } = updateJobStatusDto;

    // Define mandatory prerequisite current status for valid state machine transitions
    let expectedCurrentStatus: JobStatus;
    if (targetStatus === JobStatus.RUNNING) {
      expectedCurrentStatus = JobStatus.PENDING;
    } else if (targetStatus === JobStatus.COMPLETED || targetStatus === JobStatus.FAILED) {
      expectedCurrentStatus = JobStatus.RUNNING;
    } else {
      // Transitioning to 'pending' or any other state is invalid
      throw new ConflictException(
        `Invalid target status "${targetStatus}". Jobs cannot transition to "${targetStatus}".`,
      );
    }

    // Atomic SQL Update: UPDATE jobs SET status = :targetStatus WHERE id = :id AND status = :expectedCurrentStatus
    const result = await this.jobRepository.update(
      { id, status: expectedCurrentStatus },
      { status: targetStatus },
    );

    // If 1 row was updated, the atomic transition succeeded
    if (result.affected === 1) {
      return await this.jobRepository.findOneByOrFail({ id });
    }

    // If 0 rows were updated, diagnose if job is missing (404) or state/concurrency conflict (409)
    const existingJob = await this.jobRepository.findOne({ where: { id } });
    if (!existingJob) {
      throw new NotFoundException(`Job with ID "${id}" not found`);
    }

    throw new ConflictException(
      `Cannot transition job from status "${existingJob.status}" to "${targetStatus}". Allowed transitions: pending -> running, running -> completed, running -> failed.`,
    );
  }

  async remove(id: string): Promise<void> {
    const result = await this.jobRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Job with ID "${id}" not found`);
    }
  }
}
