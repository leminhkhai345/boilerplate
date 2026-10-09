import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import {
  CursorPaginationMetadata,
  CursorPaginationOptions,
  CursorPaginatedResult,
  OffsetPaginationMetadata,
  OffsetPaginationOptions,
  PaginatedResult,
} from 'shared/domain/pagination/pagination.interface';
import { InvalidCursorException } from 'shared/domain/exceptions/invalid-cursor.exception';

export async function paginate<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  options: OffsetPaginationOptions,
): Promise<{ data: T[]; totalItems: number }> {
  const pageNo = options.pageNo > 0 ? options.pageNo : 1;
  const pageSize = options.pageSize > 0 ? options.pageSize : 20;
  const skip = (pageNo - 1) * pageSize;

  const [data, totalItems] = await queryBuilder
    .skip(skip)
    .take(pageSize)
    .getManyAndCount();

  return { data, totalItems };
}

export function createOffsetPaginationResult<TDomain, TRaw = TDomain>(
  records: TRaw[],
  totalItems: number,
  options: OffsetPaginationOptions,
  mapper?: (raw: TRaw) => TDomain,
): PaginatedResult<TDomain> {
  const pageNo = options.pageNo > 0 ? options.pageNo : 1;
  const pageSize = options.pageSize > 0 ? options.pageSize : 20;
  const totalPages = Math.ceil(totalItems / pageSize);

  const data = mapper ? records.map(mapper) : (records as unknown as TDomain[]);

  const pagination: OffsetPaginationMetadata = {
    type: 'offset',
    pageNo,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: pageNo < totalPages,
    hasPreviousPage: pageNo > 1,
  };

  return {
    data,
    items: data,
    pagination,
  };
}

export const createPaginationResult = createOffsetPaginationResult;

export function encodeCursor<T extends object>(payload: T): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

export function decodeCursor<T extends object>(cursor: string): T {
  try {
    const json = Buffer.from(cursor, 'base64url').toString('utf8');
    return JSON.parse(json) as T;
  } catch {
    throw new InvalidCursorException();
  }
}

export function createCursorPaginationResult<TDomain, TRaw = TDomain>(
  records: TRaw[],
  options: CursorPaginationOptions,
  getCursorPayload?: (item: TRaw) => object,
  mapper?: (raw: TRaw) => TDomain,
): CursorPaginatedResult<TDomain> {
  const pageSize = options.pageSize > 0 ? options.pageSize : 20;
  const hasNextPage = records.length > pageSize;
  const slicedRecords = hasNextPage ? records.slice(0, pageSize) : records;

  const data = mapper
    ? slicedRecords.map(mapper)
    : (slicedRecords as unknown as TDomain[]);

  let nextCursor: string | null = null;
  if (hasNextPage && getCursorPayload && slicedRecords.length > 0) {
    const lastItem = slicedRecords[slicedRecords.length - 1];
    nextCursor = encodeCursor(getCursorPayload(lastItem));
  }

  const pagination: CursorPaginationMetadata = {
    type: 'cursor',
    pageSize,
    nextCursor,
    hasNextPage,
  };

  return {
    data,
    pagination,
  };
}
