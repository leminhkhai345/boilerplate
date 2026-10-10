import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import {
  CursorPaginationMetadata,
  CursorPaginationOptions,
  CursorPaginatedResult,
  OffsetPaginationMetadata,
  OffsetPaginationOptions,
  PaginatedResult,
  SortOrder,
} from 'shared/domain/pagination/pagination.interface';
import { InvalidCursorException } from 'shared/domain/exceptions/invalid-cursor.exception';
import { ValidationException } from 'shared/domain/exceptions/validation.exception';

export interface SortOptionConfig {
  whitelist: string[];
  defaultSort: string;
  defaultOrder?: SortOrder;
  tieBreakerField?: string;
  alias?: string;
}

/**
 * Áp dụng sorting theo §11 api-conventions.md
 */
function applySortingToQueryBuilder<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  options: { sort?: string; order?: SortOrder },
  config: SortOptionConfig,
): void {
  const {
    whitelist,
    defaultSort,
    defaultOrder = 'asc',
    tieBreakerField = 'id',
    alias,
  } = config;

  let sortField = defaultSort;
  const sortOrder = options.order || defaultOrder;

  if (options.sort) {
    if (!whitelist.includes(options.sort)) {
      throw new ValidationException(
        `Sort field '${options.sort}' is not allowed. Whitelist: ${whitelist.join(', ')}`,
      );
    }
    sortField = options.sort;
  } else if (options.order) {
    sortField = defaultSort;
  }

  const prefix = alias ? `${alias}.` : '';
  const orderDirection = sortOrder.toUpperCase() as 'ASC' | 'DESC';

  queryBuilder.orderBy(`${prefix}${sortField}`, orderDirection);

  if (tieBreakerField && sortField !== tieBreakerField) {
    queryBuilder.addOrderBy(`${prefix}${tieBreakerField}`, 'ASC');
  }
}

/**
 * Builder class cho Offset Pagination (Fluent API)
 */
export class TypeOrmOffsetPaginator<TEntity extends ObjectLiteral> {
  private sortConfig?: SortOptionConfig;

  constructor(
    private readonly queryBuilder: SelectQueryBuilder<TEntity>,
    private readonly options: OffsetPaginationOptions,
  ) {}

  public static of<TEntity extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<TEntity>,
    options: OffsetPaginationOptions,
  ): TypeOrmOffsetPaginator<TEntity> {
    return new TypeOrmOffsetPaginator(queryBuilder, options);
  }

  public withSort(config: SortOptionConfig): this {
    this.sortConfig = config;
    return this;
  }

  public async paginate<TDomain = TEntity>(
    mapper?: (raw: TEntity) => TDomain,
  ): Promise<PaginatedResult<TDomain>> {
    if (this.sortConfig) {
      applySortingToQueryBuilder(
        this.queryBuilder,
        this.options,
        this.sortConfig,
      );
    }

    const pageNo = this.options.pageNo > 0 ? this.options.pageNo : 1;
    const pageSize = this.options.pageSize > 0 ? this.options.pageSize : 20;
    const skip = (pageNo - 1) * pageSize;

    const [records, totalItems] = await this.queryBuilder
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    const totalPages = Math.ceil(totalItems / pageSize);
    const data = mapper
      ? records.map(mapper)
      : (records as unknown as TDomain[]);

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
}

/**
 * Builder class cho Cursor Pagination (Fluent API)
 */
export class TypeOrmCursorPaginator<TEntity extends ObjectLiteral> {
  private sortConfig?: SortOptionConfig;
  private cursorPayloadExtractor?: (item: TEntity) => object;

  constructor(
    private readonly queryBuilder: SelectQueryBuilder<TEntity>,
    private readonly options: CursorPaginationOptions,
  ) {}

  public static of<TEntity extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<TEntity>,
    options: CursorPaginationOptions,
  ): TypeOrmCursorPaginator<TEntity> {
    return new TypeOrmCursorPaginator(queryBuilder, options);
  }

  public withSort(config: SortOptionConfig): this {
    this.sortConfig = config;
    return this;
  }

  public withCursorPayload(extractor: (item: TEntity) => object): this {
    this.cursorPayloadExtractor = extractor;
    return this;
  }

  public async paginate<TDomain = TEntity>(
    mapper?: (raw: TEntity) => TDomain,
  ): Promise<CursorPaginatedResult<TDomain>> {
    if (this.sortConfig) {
      applySortingToQueryBuilder(
        this.queryBuilder,
        this.options,
        this.sortConfig,
      );
    }

    const pageSize = this.options.pageSize > 0 ? this.options.pageSize : 20;
    // Lấy pageSize + 1 bản ghi để kiểm tra hasNextPage mà không cần COUNT
    const records = await this.queryBuilder.take(pageSize + 1).getMany();

    const hasNextPage = records.length > pageSize;
    const slicedRecords = hasNextPage ? records.slice(0, pageSize) : records;

    const data = mapper
      ? slicedRecords.map(mapper)
      : (slicedRecords as unknown as TDomain[]);

    let nextCursor: string | null = null;
    if (
      hasNextPage &&
      this.cursorPayloadExtractor &&
      slicedRecords.length > 0
    ) {
      const lastItem = slicedRecords[slicedRecords.length - 1];
      nextCursor = TypeOrmPaginator.encodeCursor(
        this.cursorPayloadExtractor(lastItem),
      );
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
}

/**
 * Facade entrypoint cho TypeORM Paginator Builders & Utilities
 */
export class TypeOrmPaginator {
  public static offset<TEntity extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<TEntity>,
    options: OffsetPaginationOptions,
  ): TypeOrmOffsetPaginator<TEntity> {
    return new TypeOrmOffsetPaginator(queryBuilder, options);
  }

  public static cursor<TEntity extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<TEntity>,
    options: CursorPaginationOptions,
  ): TypeOrmCursorPaginator<TEntity> {
    return new TypeOrmCursorPaginator(queryBuilder, options);
  }

  public static encodeCursor<T extends object>(payload: T): string {
    return Buffer.from(JSON.stringify(payload)).toString('base64url');
  }

  public static decodeCursor<T extends object>(cursor: string): T {
    try {
      const json = Buffer.from(cursor, 'base64url').toString('utf8');
      return JSON.parse(json) as T;
    } catch {
      throw new InvalidCursorException();
    }
  }

  public static parseFilterCommaValues(value?: string | string[]): string[] {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
}
