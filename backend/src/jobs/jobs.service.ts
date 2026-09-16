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
      status: JobStatus.PENDING, // Always forced to pending
    });
    return await this.jobRepository.save(job);
  }

  async findAll(): Promise<Job[]> {
    return await this.jobRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, updateJobStatusDto: UpdateJobStatusDto): Promise<Job> {
    const job = await this.jobRepository.findOne({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job with ID "${id}" not found`);
    }

    const currentStatus = job.status;
    const targetStatus = updateJobStatusDto.status;

    // Allowed status transitions:
    // pending -> running
    // running -> completed
    // running -> failed
    // A completed or failed job cannot become running or change status again.
    const isValidTransition =
      (currentStatus === JobStatus.PENDING && targetStatus === JobStatus.RUNNING) ||
      (currentStatus === JobStatus.RUNNING && targetStatus === JobStatus.COMPLETED) ||
      (currentStatus === JobStatus.RUNNING && targetStatus === JobStatus.FAILED);

    if (!isValidTransition) {
      throw new ConflictException(
        `Invalid status transition from "${currentStatus}" to "${targetStatus}". Allowed transitions: pending -> running, running -> completed, running -> failed.`,
      );
    }

    job.status = targetStatus;
    return await this.jobRepository.save(job);
  }

  async remove(id: string): Promise<void> {
    const result = await this.jobRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Job with ID "${id}" not found`);
    }
  }
}
