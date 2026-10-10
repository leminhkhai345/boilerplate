import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseCode } from 'shared/decorators/response-code.decorator';
import { GetHealthQuery } from '../../use-case/queries/get-health.query';
import { HealthEntity } from '../../domain/entities/health.entity';
import { HealthResponseDto } from '../response/health.response.dto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseCode('HEALTH_CHECK_PASSED')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    type: HealthResponseDto,
  })
  async check(): Promise<HealthResponseDto> {
    const health: HealthEntity = await this.queryBus.execute(
      new GetHealthQuery(),
    );

    return HealthResponseDto.fromDomain(health);
  }
}
