import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import {
  CursorPaginationMetadata,
  CursorPaginationOptions,
  CursorPaginatedResult,
} from 'shared/domain/pagination/pagination.interface';
import { applySortingToQueryBuilder, SortOptionConfig } from './sort.helper';
import { CursorUtils } from './cursor.utils';

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
      nextCursor = CursorUtils.encodeCursor(
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
