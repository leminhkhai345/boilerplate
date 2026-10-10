import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetHealthQuery } from './get-health.query';
import { HEALTH_DI_TOKEN } from '../../health.di-token';
import { HealthCheckerService } from '../../domain/services/health-checker.service';
import { HealthEntity } from '../../domain/entities/health.entity';

@QueryHandler(GetHealthQuery)
export class GetHealthQueryHandler implements IQueryHandler<
  GetHealthQuery,
  HealthEntity
> {
  constructor(
    @Inject(HEALTH_DI_TOKEN.SERVICE)
    private readonly healthService: HealthCheckerService,
  ) {}

  async execute(_query: GetHealthQuery): Promise<HealthEntity> {
    return this.healthService.check();
  }
}
