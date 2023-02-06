import { IMultipartMessage } from '@lib/types';

export interface IMultipartItem {
  lastLoadDate: Date;
  messages: IMultipartMessage[];
}

export interface IMultipartData {
  [multipartId: string]: IMultipartItem;
}

export type MessagesState = {
  readonly multipartData: IMultipartData;
  readonly loading: boolean;
  readonly loadingData: boolean;
  readonly loadingError: string;
  readonly errorMessage: string;
};
