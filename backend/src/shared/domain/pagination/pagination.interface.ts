export type PaginationType = 'offset' | 'cursor';

export type SortOrder = 'asc' | 'desc';

export type ExportFormat = 'json' | 'xlsx' | 'csv' | 'pdf';

export interface OffsetPaginationOptions<TFilter = Record<string, unknown>> {
  pageNo: number;
  pageSize: number;
  sort?: string;
  order?: SortOrder;
  filter?: TFilter;
  format?: ExportFormat;
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

export interface CursorPaginationOptions<TFilter = Record<string, unknown>> {
  cursor?: string | null;
  pageSize: number;
  sort?: string;
  order?: SortOrder;
  filter?: TFilter;
  format?: ExportFormat;
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

export type PaginationOptions<TFilter = Record<string, unknown>> =
  OffsetPaginationOptions<TFilter>;
export type PaginationResult<T> = PaginatedResult<T>;
