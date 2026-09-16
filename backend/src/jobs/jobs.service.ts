import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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
      ...createJobDto,
      status: JobStatus.PENDING,
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

    // Validate status transitions:
    // pending -> running
    // running -> completed
    // running -> failed
    // Completed or failed jobs cannot transition again.
    const isValidTransition =
      (currentStatus === JobStatus.PENDING && targetStatus === JobStatus.RUNNING) ||
      (currentStatus === JobStatus.RUNNING && targetStatus === JobStatus.COMPLETED) ||
      (currentStatus === JobStatus.RUNNING && targetStatus === JobStatus.FAILED);

    if (!isValidTransition) {
      throw new BadRequestException(
        `Invalid status transition from "${currentStatus}" to "${targetStatus}"`,
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
