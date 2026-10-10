export interface DatabaseHealth {
  status: 'up' | 'down';
  responseTimeMs?: number;
  error?: string;
}

export class HealthEntity {
  constructor(
    public readonly status: 'ok' | 'error',
    public readonly timestamp: string,
    public readonly uptime: number,
    public readonly environment: string,
    public readonly database: DatabaseHealth,
  ) {}

  get isHealthy(): boolean {
    return this.status === 'ok';
  }
}
