import { Injectable } from '@nestjs/common';
import { HealthCheckerService } from '../../domain/services/health-checker.service';
import { HealthEntity } from '../../domain/entities/health.entity';
import { ApiConfigService } from 'shared/services/api-config.service';

@Injectable()
export class SystemHealthCheckerService implements HealthCheckerService {
  constructor(private readonly configService: ApiConfigService) {}

  async check(): Promise<HealthEntity> {
    return new HealthEntity(
      'ok',
      new Date().toISOString(),
      Math.round(process.uptime() * 100) / 100,
      this.configService.nodeEnv,
    );
  }
}
