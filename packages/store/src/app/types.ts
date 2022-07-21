export interface IFormParam {
  [fieldName: string]: unknown;
}

export interface IAppState {
  loading: boolean;
  errorMessage: string;
  errorList: string[];
  formParams?: IFormParam;
  syncDate?: Date;
  list?: [];
  readonly loadingData: boolean;
  readonly loadingError: string;
}
