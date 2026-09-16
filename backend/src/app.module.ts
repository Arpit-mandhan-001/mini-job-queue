import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsModule } from './jobs/jobs.module';
import { HealthModule } from './health/health.module';
import { Job } from './jobs/entities/job.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST') || configService.get<string>('DB_HOST', 'localhost'),
        port: Number(configService.get('DATABASE_PORT') || configService.get('DB_PORT', 5432)),
        username: configService.get<string>('DATABASE_USERNAME') || configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DATABASE_PASSWORD') || configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DATABASE_NAME') || configService.get<string>('DB_NAME', 'mini_job_queue'),
        entities: [Job],
        synchronize: true, // Auto-schema sync for development assignment simplicity
      }),
      inject: [ConfigService],
    }),
    JobsModule,
    HealthModule,
  ],
})
export class AppModule {}
