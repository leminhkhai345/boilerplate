import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Uuid } from 'shared/domain/value-objects/uuid.vo';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
