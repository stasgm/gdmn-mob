export interface IFormParam {
  [fieldName: string]: unknown;
}

export interface IAppState {
  loading: boolean;
  errorMessage: string;
  errorList: string[];
  formParams?: IFormParam;
  syncDate?: Date;
  readonly loadingData: boolean;
  readonly loadingError: string;
}

export interface IErrorNotice {
  id: string;
  name: string;
  date: Date;
  message: string;
}
