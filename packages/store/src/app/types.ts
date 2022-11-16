import { IDeviceLog, INamedEntity } from '@lib/types';

export interface IFormParam {
  [fieldName: string]: unknown;
}

export interface IAppState {
  loading: boolean;
  showSyncInfo: boolean;
  autoSync: boolean;
  errorLog: IDeviceLog[];
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

export type IErrorNotice = Omit<IDeviceLog, 'isSent'>;
