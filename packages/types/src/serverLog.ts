import { IEntity } from './common';

export interface IServerLogFile extends IEntity {
  [key: string]: unknown;
  date: string;
  size: number;
  fileName: string;
  path: string;
  mdate: string;
}
