import { BaseEntity } from '../entities/base.entity';
import {
  PaginationOptions,
  PaginationResult,
} from '../pagination/pagination.interface';
import { Uuid } from '../value-objects/uuid.vo';

export interface BaseRepository<T extends BaseEntity> {
  save(entity: T): Promise<void>;

  findAll(): Promise<T[]>;

  findPaginated(options: PaginationOptions): Promise<PaginationResult<T>>;

  findById(id: Uuid): Promise<T | null>;

  delete(id: Uuid): Promise<void>;
}
