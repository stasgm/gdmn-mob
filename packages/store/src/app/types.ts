export interface IFormParam {
  [fieldName: string]: unknown;
}

export interface IAppState {
  loading: boolean;
  showSyncInfo: boolean;
  autoSync: boolean;
  errorList: IErrorNotice[];
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

export interface IErrorNotice {
  id: string;
  name: string;
  date: Date;
  message: string;
}
