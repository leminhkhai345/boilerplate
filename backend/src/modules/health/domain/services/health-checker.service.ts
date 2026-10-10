import { HealthEntity } from '../entities/health.entity';

export interface HealthCheckerService {
  check(): Promise<HealthEntity>;
}
