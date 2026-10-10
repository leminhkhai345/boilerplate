import { ApiProperty } from '@nestjs/swagger';
import { HealthEntity } from '../../domain/entities/health.entity';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ example: '2026-10-10T03:25:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: 125.4, description: 'Uptime in seconds' })
  uptime: number;

  @ApiProperty({ example: 'dev' })
  environment: string;

  static fromDomain(entity: HealthEntity): HealthResponseDto {
    const dto = new HealthResponseDto();
    dto.status = entity.status;
    dto.timestamp = entity.timestamp;
    dto.uptime = entity.uptime;
    dto.environment = entity.environment;
    return dto;
  }
}
