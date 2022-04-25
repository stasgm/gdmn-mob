import { IProcess } from '@lib/types';

export type IProcessState = {
  readonly list: IProcess[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
