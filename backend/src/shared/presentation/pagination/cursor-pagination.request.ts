import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import {
  CursorPaginationOptions,
  SortOrder,
} from 'shared/domain/pagination/pagination.interface';

export class CursorPaginationQueryRequest<
  TFilter = Record<string, unknown>,
> implements CursorPaginationOptions<TFilter> {
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

  @ApiPropertyOptional({
    description:
      'Một field từ whitelist của endpoint; ví dụ: createdAt. Client chỉ gửi một sort, không chứa dấu phẩy.',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString({ message: 'sort must be a single string' })
  @Matches(/^[^,]+$/, {
    message: 'sort cannot contain commas and must be a single field',
  })
  sort?: string;

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp: asc hoặc desc (chỉ áp dụng cho sort)',
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'order must be either asc or desc',
  })
  order?: SortOrder = 'asc';

  @ApiPropertyOptional({
    description:
      'Object có field được endpoint cho phép, serialized theo OpenAPI deepObject',
    type: Object,
  })
  @IsOptional()
  @IsObject({ message: 'filter must be an object' })
  filter?: TFilter;
}
