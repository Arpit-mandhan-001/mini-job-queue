import { IsEnum, IsNotEmpty } from 'class-validator';
import { JobStatus } from '../entities/job.entity';

export class UpdateJobStatusDto {
  @IsNotEmpty()
  @IsEnum(JobStatus)
  status: JobStatus;
}
