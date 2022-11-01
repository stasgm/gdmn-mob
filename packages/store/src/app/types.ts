export interface IFormParam {
  [fieldName: string]: unknown;
}

export interface ISyncInfo {
  requestList: IRequestNotice[];
  errorList: ILog[];
}

export interface IAppState {
  loading: boolean;
  loadedWithError: boolean;
  autoSync: boolean;
  errorMessage: string;
  errorList: ILog[];
  formParams?: IFormParam;
  syncDate?: Date;
  // syncInfo?: ISyncInfo;
  requestNotice: IRequestNotice[];
  readonly loadingData: boolean;
  readonly loadingError: string;
}

export interface IRequestNotice {
  message: string;
  started: Date;
}

export interface ILog {
  id: string;
  message: string;
  date: Date;
}
