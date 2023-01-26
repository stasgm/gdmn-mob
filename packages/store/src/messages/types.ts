import { IMessage } from '@lib/types';

export interface IMultipartMessage {
  multipartSeq: number;
  data: any;
}

export interface IMultipartItem {
  lastLoadDate: Date;
  messages: IMultipartMessage[];
}

export interface IMultipartData {
  [multipartId: string]: IMultipartItem;
}

export type MessagesState = {
  readonly data: IMessage[];
  multipartData: IMultipartData;
  readonly loading: boolean;
  readonly errorMessage: string;
};
