import { CmdName, IDeviceLog } from '@lib/types';

export interface IFormParam {
  [fieldName: string]: unknown;
}

export interface IScreenFormParams {
  [screenName: string]: IFormParam;
}

export interface IAppState {
  loading: boolean;
  showSyncInfo: boolean;
  autoSync: boolean;
  errorLog: IDeviceLog[];
  formParams?: IFormParam;
  screenFormParams?: IScreenFormParams;
  syncDate?: Date;
  syncRequests: ISyncRequest[];
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

export interface ISyncRequest {
  cmdName: CmdName;
  date: Date;
}
