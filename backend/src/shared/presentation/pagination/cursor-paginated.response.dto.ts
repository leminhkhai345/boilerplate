import { ApiProperty } from '@nestjs/swagger';
import { CursorPaginationDto } from './cursor-pagination.dto';

export class CursorPaginatedResponseDto<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty({ type: CursorPaginationDto })
  pagination: CursorPaginationDto;
}
