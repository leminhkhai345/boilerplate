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
  ExportFormat,
  OffsetPaginationOptions,
  SortOrder,
} from 'shared/domain/pagination/pagination.interface';

export class OffsetPaginationQueryRequest<
  TFilter = Record<string, unknown>,
> implements OffsetPaginationOptions<TFilter> {
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
      'Object có field được endpoint cho phép, serialized theo OpenAPI deepObject (ví dụ: filter[status]=available)',
    type: Object,
  })
  @IsOptional()
  @IsObject({ message: 'filter must be an object' })
  filter?: TFilter;

  @ApiPropertyOptional({
    description:
      'Chỉ dùng trên collection GET để tải file: xlsx, csv, pdf, json (mặc định json)',
    enum: ['json', 'xlsx', 'csv', 'pdf'],
    default: 'json',
  })
  @IsOptional()
  @IsIn(['json', 'xlsx', 'csv', 'pdf'], {
    message: 'format must be one of: json, xlsx, csv, pdf',
  })
  format?: ExportFormat = 'json';
}

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

  @ApiPropertyOptional({
    description:
      'Chỉ dùng trên collection GET để tải file: xlsx, csv, pdf, json (mặc định json)',
    enum: ['json', 'xlsx', 'csv', 'pdf'],
    default: 'json',
  })
  @IsOptional()
  @IsIn(['json', 'xlsx', 'csv', 'pdf'], {
    message: 'format must be one of: json, xlsx, csv, pdf',
  })
  format?: ExportFormat = 'json';
}

export { OffsetPaginationQueryRequest as PaginationQueryRequest };
