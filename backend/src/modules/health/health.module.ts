import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HealthController } from './presentation/controllers/health.controller';
import { GetHealthQueryHandler } from './use-case/queries/get-health.query.handler';
import { SystemHealthCheckerService } from './infra/services/system-health-checker.service';
import { HEALTH_DI_TOKEN } from './health.di-token';

const queryHandlers = [GetHealthQueryHandler];

@Module({
  imports: [CqrsModule],
  controllers: [HealthController],
  providers: [
    {
      provide: HEALTH_DI_TOKEN.SERVICE,
      useClass: SystemHealthCheckerService,
    },
    ...queryHandlers,
  ],
  exports: [HEALTH_DI_TOKEN.SERVICE],
})
export class HealthModule {}
