import { INamedEntity, StatusType } from '@lib/types';

export interface IFormParam {
  [fieldName: string]: unknown;
}

export interface IAppState {
  formParams?: IFormParam;
}

export interface IOrderFormParam extends IFormParam {
  contact?: INamedEntity;
  outlet?: INamedEntity;
  depart?: INamedEntity;
  number?: string;
  documentDate?: string;
  onDate?: string;
  status?: StatusType;
  route?: INamedEntity;
}

export interface IReturnFormParam extends IFormParam {
  contact?: INamedEntity;
  outlet?: INamedEntity;
  number?: string;
  documentDate?: string;
  depart?: INamedEntity;
  reason?: string;
  route?: INamedEntity;
  status?: StatusType;
}
