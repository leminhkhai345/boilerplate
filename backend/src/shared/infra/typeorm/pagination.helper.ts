import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import {
  PaginationOptions,
  PaginationResult,
} from 'shared/domain/pagination/pagination.interface';

export async function paginate<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  options: PaginationOptions,
): Promise<{ data: T[]; total: number }> {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const [data, total] = await queryBuilder
    .skip(skip)
    .take(limit)
    .getManyAndCount();
  return { data, total };
}

export function createPaginationResult<T>(
  items: T[],
  total: number,
  options: PaginationOptions,
): PaginationResult<T> {
  const limit = options.limit > 0 ? options.limit : 10;
  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    page: options.page,
    limit,
    totalPages,
    hasNext: options.page < totalPages,
    hasPrev: options.page > 1,
  };
}

