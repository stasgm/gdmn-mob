import { IMessage } from '@lib/types';

export type IMesState = {
  readonly data: IMessage[] | undefined;
  readonly loading: boolean;
  readonly errorMessage: string;
};

export type IMesPayload = Partial<{
  errorMessage: string;
  data: IMessage[];
}>;
