import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import {
  CursorPaginationOptions,
  OffsetPaginationOptions,
} from 'shared/domain/pagination/pagination.interface';
import { TypeOrmOffsetPaginator } from './offset.paginator';
import { TypeOrmCursorPaginator } from './cursor.paginator';
import { CursorUtils } from './cursor.utils';

/**
 * Facade entrypoint cho TypeORM Paginator Builders & Utilities
 */
export class TypeOrmPaginator {
  public static offset<TEntity extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<TEntity>,
    options: OffsetPaginationOptions,
  ): TypeOrmOffsetPaginator<TEntity> {
    return TypeOrmOffsetPaginator.of(queryBuilder, options);
  }

  public static cursor<TEntity extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<TEntity>,
    options: CursorPaginationOptions,
  ): TypeOrmCursorPaginator<TEntity> {
    return TypeOrmCursorPaginator.of(queryBuilder, options);
  }

  public static encodeCursor<T extends object>(payload: T): string {
    return CursorUtils.encodeCursor(payload);
  }

  public static decodeCursor<T extends object>(cursor: string): T {
    return CursorUtils.decodeCursor(cursor);
  }

  public static parseFilterCommaValues(value?: string | string[]): string[] {
    return CursorUtils.parseFilterCommaValues(value);
  }
}
