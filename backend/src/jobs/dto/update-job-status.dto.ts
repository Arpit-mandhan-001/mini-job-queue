import { IsEnum, IsNotEmpty } from 'class-validator';
import { JobStatus } from '../entities/job.entity';

export class UpdateJobStatusDto {
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(JobStatus, {
    message: `Status must be one of the following allowed values: ${Object.values(JobStatus).join(', ')}`,
  })
  status: JobStatus;
}
