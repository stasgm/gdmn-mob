import { INamedEntity } from '@lib/types';

export interface IFormParam {
  [fieldName: string]: unknown;
}

export interface IAppState {
  loading: boolean;
  showSyncInfo: boolean;
  autoSync: boolean;
  errorLog: IErrorLog[];
  formParams?: IFormParam;
  syncDate?: Date;
  requestNotice: IRequestNotice[];
  errorNotice: IErrorNotice[];
  readonly loadingData: boolean;
  readonly loadingError: string;
}

export interface IRequestNotice {
  message: string;
  started: Date;
}

export interface IErrorNotice extends INamedEntity {
  date: string;
  message: string;
}

export interface IErrorLog extends IErrorNotice {
  isSent?: boolean;
}
