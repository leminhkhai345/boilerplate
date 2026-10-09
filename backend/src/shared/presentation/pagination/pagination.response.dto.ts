import { ApiProperty } from '@nestjs/swagger';
import {
  CursorPaginationMetadata,
  OffsetPaginationMetadata,
  PaginatedResult,
} from 'shared/domain/pagination/pagination.interface';

export class OffsetPaginationDto implements OffsetPaginationMetadata {
  @ApiProperty({
    example: 'offset',
    description: 'Discriminator phân loại kiểu phân trang',
    enum: ['offset'],
  })
  type = 'offset' as const;

  @ApiProperty({
    example: 1,
    description: 'Số thứ tự trang hiện tại',
  })
  pageNo: number;

  @ApiProperty({
    example: 20,
    description: 'Số lượng bản ghi trên một trang',
  })
  pageSize: number;

  @ApiProperty({
    example: 2,
    description: 'Tổng số lượng bản ghi',
  })
  totalItems: number;

  @ApiProperty({
    example: 1,
    description: 'Tổng số trang',
  })
  totalPages: number;

  @ApiProperty({
    example: false,
    description: 'Có trang kế tiếp hay không',
  })
  hasNextPage: boolean;

  @ApiProperty({
    example: false,
    description: 'Có trang trước đó hay không',
  })
  hasPreviousPage: boolean;
}

export class CursorPaginationDto implements CursorPaginationMetadata {
  @ApiProperty({
    example: 'cursor',
    description: 'Discriminator phân loại kiểu phân trang',
    enum: ['cursor'],
  })
  type = 'cursor' as const;

  @ApiProperty({
    example: 20,
    description: 'Số lượng bản ghi trên một trang',
  })
  pageSize: number;

  @ApiProperty({
    example:
      'eyJjcmVhdGVkQXQiOiIyMDI2LTA5LTE1VDAzOjAwOjAwLjAwMFoiLCJpZCI6IjdkN2ZiYmFjLTc3MDEtNDE0My1iNWM2LTBiNjI2MjAzNTZlMCJ9',
    description: 'Opaque cursor cho trang tiếp theo (null nếu hết trang)',
    nullable: true,
  })
  nextCursor: string | null;

  @ApiProperty({
    example: true,
    description: 'Có trang kế tiếp hay không',
  })
  hasNextPage: boolean;
}

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

export class CursorPaginatedResponseDto<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty({ type: CursorPaginationDto })
  pagination: CursorPaginationDto;
}
