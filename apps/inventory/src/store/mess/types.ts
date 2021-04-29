import { IDBMessage } from '@lib/types';

export type IMesState = {
  readonly data: IDBMessage[] | undefined;
  readonly loading: boolean;
  readonly errorMessage: string;
};

export type IMesPayload = Partial<{
  errorMessage: string;
  data: IDBMessage[];
}>;
