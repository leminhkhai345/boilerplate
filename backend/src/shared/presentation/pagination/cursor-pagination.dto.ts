import { ApiProperty } from '@nestjs/swagger';
import { CursorPaginationMetadata } from 'shared/domain/pagination/pagination.interface';

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
