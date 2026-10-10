import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResult } from 'shared/domain/pagination/pagination.interface';
import { OffsetPaginationDto } from './offset-pagination.dto';

export class PaginatedResponseDto<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty({ type: OffsetPaginationDto })
  pagination: OffsetPaginationDto;

  static fromResult<T>(result: PaginatedResult<T>): PaginatedResponseDto<T> {
    const dto = new PaginatedResponseDto<T>();
    dto.data = result.data;
    dto.pagination = result.pagination;
    return dto;
  }
}
