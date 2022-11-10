import { INamedEntity } from '@lib/types';

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

export interface IErrorNotice extends INamedEntity {
  date: string;
  message: string;
}

export interface IErrorLogs extends IErrorNotice {
  isSent?: boolean;
}
