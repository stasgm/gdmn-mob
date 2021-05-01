import { IMessage } from '@lib/types';

export type IMessagesState = {
  readonly data: IMessage[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
