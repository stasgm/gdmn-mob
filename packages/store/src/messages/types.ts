import { IMessage } from '@lib/types';

export type MessagesState = {
  readonly data: IMessage[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
