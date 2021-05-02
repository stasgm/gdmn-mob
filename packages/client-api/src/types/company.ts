import { IUser, ICompany } from '@lib/types';

export interface ICompanyQueryResponse {
  type: 'GET_COMPANY' | 'GET_COMPANIES' | 'ADD_COMPANY' | 'UPDATE_COMPANY' | 'GET_USERS_BY_COMPANY' | 'REMOVE_COMPANY';
}

export interface IGetCompanyResponse extends ICompanyQueryResponse {
  type: 'GET_COMPANY';
  company: ICompany;
}

export interface IGetCompaniesResponse extends ICompanyQueryResponse {
  type: 'GET_COMPANIES';
  companies: ICompany[];
}

export interface IAddCompanyResponse extends ICompanyQueryResponse {
  type: 'ADD_COMPANY';
  company: ICompany;
}

export interface IUpdateCompanyResponse extends ICompanyQueryResponse {
  type: 'UPDATE_COMPANY';
  company: ICompany;
}

export interface IGetCompanyUsersResponse extends ICompanyQueryResponse {
  type: 'GET_USERS_BY_COMPANY';
  users: IUser[];
}

export interface IRemoveCompanyResponse extends ICompanyQueryResponse {
  type: 'REMOVE_COMPANY';
}

export type AuthQueryResponse =
  | IGetCompanyResponse
  | IGetCompaniesResponse
  | IAddCompanyResponse
  | IUpdateCompanyResponse
  | IGetCompanyUsersResponse
  | IRemoveCompanyResponse;
