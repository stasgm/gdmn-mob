import { BaseEntity } from '../../../types';

export enum TodoStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface Todo extends BaseEntity {
  title: string;
  description: string;
  status: TodoStatus;
}
