import { BaseEntity } from '../../../types';

// eslint-disable-next-line no-shadow
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
