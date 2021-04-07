import { ICompany } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('COMPANY/INIT')();

const fetchCompaniesAsync = createAsyncAction('COMPANY/FETCH', 'COMPANY/FETCH_SUCCCES', 'COMPANY/FETCH_FAILURE')<
  string | undefined,
  ICompany[],
  string
>();

const addCompanyAsync = createAsyncAction('COMPANY/ADD', 'COMPANY/ADD_SUCCCES', 'COMPANY/ADD_FAILURE')<
  string | undefined,
  ICompany,
  string
>();

const updateCompanyAsync = createAsyncAction('COMPANY/UPDATE', 'COMPANY/UPDATE_SUCCCES', 'COMPANY/UPDATE_FAILURE')<
  string | undefined,
  ICompany,
  string
>();

export const companyActions = {
  fetchCompaniesAsync,
  addCompanyAsync,
  updateCompanyAsync,
  init,
};

export type CompanyActionType = ActionType<typeof companyActions>;
