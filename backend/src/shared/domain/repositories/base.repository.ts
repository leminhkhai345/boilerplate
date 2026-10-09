import { BaseEntity } from '../entities/base.entity';
import {
  OffsetPaginationOptions,
  PaginatedResult,
} from '../pagination/pagination.interface';
import { Uuid } from '../value-objects/uuid.vo';

export interface BaseRepository<T extends BaseEntity> {
  save(entity: T): Promise<void>;

  findAll(): Promise<T[]>;

  findPaginated(options: OffsetPaginationOptions): Promise<PaginatedResult<T>>;

  findById(id: Uuid): Promise<T | null>;

  delete(id: Uuid): Promise<void>;
}
