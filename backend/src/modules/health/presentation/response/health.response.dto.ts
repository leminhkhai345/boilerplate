import { ApiProperty } from '@nestjs/swagger';
import { HealthEntity } from '../../domain/entities/health.entity';

export class DatabaseHealthDto {
  @ApiProperty({ example: 'up', enum: ['up', 'down'] })
  status: 'up' | 'down';

  @ApiProperty({
    example: 4,
    description: 'Response time in ms',
    required: false,
  })
  responseTimeMs?: number;

  @ApiProperty({ example: 'Connection error', required: false })
  error?: string;
}

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', enum: ['ok', 'error'] })
  status: 'ok' | 'error';

  @ApiProperty({ example: '2026-10-10T03:25:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: 125.4, description: 'Uptime in seconds' })
  uptime: number;

  @ApiProperty({ example: 'dev' })
  environment: string;

  @ApiProperty({ type: DatabaseHealthDto })
  database: DatabaseHealthDto;

  static fromDomain(entity: HealthEntity): HealthResponseDto {
    const dto = new HealthResponseDto();
    dto.status = entity.status;
    dto.timestamp = entity.timestamp;
    dto.uptime = entity.uptime;
    dto.environment = entity.environment;
    dto.database = entity.database;
    return dto;
  }
}
