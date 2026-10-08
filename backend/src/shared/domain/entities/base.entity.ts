import { Uuid } from '../value-objects/uuid.vo';

export abstract class BaseEntity {
  constructor(
    readonly id: Uuid,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
