import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationResult } from 'shared/domain/pagination/pagination.interface';

export class PaginatedResponseDto<T> {
  @ApiProperty()
  items: T[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiPropertyOptional()
  hasNext?: boolean;

  @ApiPropertyOptional()
  hasPrev?: boolean;

  static fromResult<T>(result: PaginationResult<T>): PaginatedResponseDto<T> {
    const dto = new PaginatedResponseDto<T>();
    dto.items = result.items;
    dto.total = result.total;
    dto.page = result.page;
    dto.limit = result.limit;
    dto.totalPages = result.totalPages;
    dto.hasNext = result.hasNext;
    dto.hasPrev = result.hasPrev;
    return dto;
  }
}

