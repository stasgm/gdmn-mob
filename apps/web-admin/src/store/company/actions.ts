import { ICompany } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('COMPANY/INIT')();

const fetchCompaniesAsync = createAsyncAction('COMPANY/FETCH', 'COMPANY/FETCH_SUCCCES', 'COMPANY/FETCH_FAILURE')<
  string | undefined,
  ICompany[],
  string
>();

export const companyActions = {
  fetchCompaniesAsync,
  init,
};

export type CompanyActionType = ActionType<typeof companyActions>;
