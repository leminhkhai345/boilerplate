import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SampleRepository } from '../../domain/repositories/sample.repository';
import { SampleEntity } from '../../domain/entities/sample.entity';
import { SampleTypeormEntity } from './sample.typeorm-entity';
import { SampleMapper } from '../mappers/sample.mapper';
import { Uuid } from 'shared/domain/value-objects/uuid.vo';
import {
  PaginationOptions,
  PaginationResult,
} from 'shared/domain/pagination/pagination.interface';
import { paginate } from 'shared/infra/typeorm/pagination.helper';

@Injectable()
export class TypeOrmSampleRepository implements SampleRepository {
  constructor(
    @InjectRepository(SampleTypeormEntity)
    private readonly repository: Repository<SampleTypeormEntity>,
  ) {}

  async save(sample: SampleEntity): Promise<void> {
    const raw = SampleMapper.toPersistence(sample);
    await this.repository.save(raw);
  }

  async findById(id: Uuid): Promise<SampleEntity | null> {
    const raw = await this.repository.findOne({
      where: { id, isDeleted: false },
    });
    if (!raw) {
      return null;
    }
    return SampleMapper.toDomain(raw);
  }

  async findAll(): Promise<SampleEntity[]> {
    const records = await this.repository.find({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
    });
    return records.map((r) => SampleMapper.toDomain(r));
  }

  async findPaginated(
    options: PaginationOptions,
  ): Promise<PaginationResult<SampleEntity>> {
    const qb = this.repository
      .createQueryBuilder('sample')
      .where('sample.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('sample.createdAt', 'DESC');

    const { data, total } = await paginate(qb, options);
    const limit = options.limit > 0 ? options.limit : 10;
    const totalPages = Math.ceil(total / limit);

    return {
      items: data.map((r) => SampleMapper.toDomain(r)),
      total,
      page: options.page,
      limit: options.limit,
      totalPages,
      hasNext: options.page < totalPages,
      hasPrev: options.page > 1,
    };
  }

  async delete(id: Uuid): Promise<void> {
    await this.repository.update(id, { isDeleted: true });
  }
}
