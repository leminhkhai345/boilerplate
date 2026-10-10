export class HealthEntity {
  constructor(
    public readonly status: 'ok',
    public readonly timestamp: string,
    public readonly uptime: number,
    public readonly environment: string,
  ) {}
}
