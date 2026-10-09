export type PaginationType = 'offset' | 'cursor';

export interface OffsetPaginationOptions {
  pageNo: number;
  pageSize: number;
}

export interface OffsetPaginationMetadata {
  type: 'offset';
  pageNo: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: OffsetPaginationMetadata;
  items?: T[];
}

export interface CursorPaginationOptions {
  cursor?: string | null;
  pageSize: number;
}

export interface CursorPaginationMetadata {
  type: 'cursor';
  pageSize: number;
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface CursorPaginatedResult<T> {
  data: T[];
  pagination: CursorPaginationMetadata;
}

export type PaginationMetadata =
  OffsetPaginationMetadata | CursorPaginationMetadata;

export type PaginationOptions = OffsetPaginationOptions;
export type PaginationResult<T> = PaginatedResult<T>;
