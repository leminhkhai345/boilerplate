import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import {
  CursorPaginationOptions,
  OffsetPaginationOptions,
} from 'shared/domain/pagination/pagination.interface';

export class OffsetPaginationQueryRequest implements OffsetPaginationOptions {
  @ApiPropertyOptional({
    description: 'Số nguyên dương, bắt đầu từ 1',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNo: number = 1;

  @ApiPropertyOptional({
    description: 'Số nguyên dương, tối đa 100',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 20;
}

export class CursorPaginationQueryRequest implements CursorPaginationOptions {
  @ApiPropertyOptional({
    description:
      'Opaque cursor do server cấp từ pagination.nextCursor của response trước. Không gửi ở trang đầu.',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({
    description: 'Số nguyên dương, tối đa 100',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 20;
}

export { OffsetPaginationQueryRequest as PaginationQueryRequest };
