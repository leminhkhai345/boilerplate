import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SampleRepository } from '../../domain/repositories/sample.repository';
import { SampleEntity } from '../../domain/entities/sample.entity';
import { SampleTypeormEntity } from './sample.typeorm-entity';
import { SampleMapper } from '../mappers/sample.mapper';
import { Uuid } from 'shared/domain/value-objects/uuid.vo';

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
    const raw = await this.repository.findOne({ where: { id } });
    if (!raw) {
      return null;
    }
    return SampleMapper.toDomain(raw);
  }

  async findAll(): Promise<SampleEntity[]> {
    const records = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return records.map((r) => SampleMapper.toDomain(r));
  }

  async delete(id: Uuid): Promise<void> {
    await this.repository.delete(id);
  }
}
