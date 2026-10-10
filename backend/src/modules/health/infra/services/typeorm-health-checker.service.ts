import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HealthCheckerService } from '../../domain/services/health-checker.service';
import { HealthEntity } from '../../domain/entities/health.entity';
import { ApiConfigService } from 'shared/services/api-config.service';

@Injectable()
export class TypeOrmHealthCheckerService implements HealthCheckerService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ApiConfigService,
  ) {}

  async check(): Promise<HealthEntity> {
    const startTime = Date.now();
    let dbStatus: 'up' | 'down' = 'up';
    let dbError: string | undefined;

    try {
      if (this.dataSource && this.dataSource.isInitialized) {
        await this.dataSource.query('SELECT 1');
      } else {
        dbStatus = 'down';
        dbError = 'Database DataSource is not initialized';
      }
    } catch (error: unknown) {
      dbStatus = 'down';
      dbError =
        error instanceof Error ? error.message : 'Database connection error';
    }

    const responseTimeMs = Date.now() - startTime;
    const isHealthy = dbStatus === 'up';

    return new HealthEntity(
      isHealthy ? 'ok' : 'error',
      new Date().toISOString(),
      Math.round(process.uptime() * 100) / 100,
      this.configService.nodeEnv,
      {
        status: dbStatus,
        responseTimeMs,
        ...(dbError ? { error: dbError } : {}),
      },
    );
  }
}
