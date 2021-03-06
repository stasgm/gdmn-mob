import { ICompany } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('COMPANY/INIT')();
const clearError = createAction('COMPANY/CLEAR_ERROR')();

const fetchCompaniesAsync = createAsyncAction(
  'COMPANY/FETCH_COMPANIES',
  'COMPANY/FETCH_COMPANIES_SUCCESS',
  'COMPANY/FETCH_COMPANIES_FAILURE',
)<string | undefined, ICompany[], string>();

const fetchCompanyAsync = createAsyncAction(
  'COMPANY/FETCH_COMPANY',
  'COMPANY/FETCH_COMPANY_SUCCESS',
  'COMPANY/FETCH_COMPANY_FAILURE',
)<string | undefined, ICompany, string>();

const addCompanyAsync = createAsyncAction('COMPANY/ADD', 'COMPANY/ADD_SUCCESS', 'COMPANY/ADD_FAILURE')<
  string | undefined,
  ICompany,
  string
>();

const updateCompanyAsync = createAsyncAction('COMPANY/UPDATE', 'COMPANY/UPDATE_SUCCESS', 'COMPANY/UPDATE_FAILURE')<
  string | undefined,
  ICompany,
  string
>();

const removeCompanyAsync = createAsyncAction('COMPANY/REMOVE', 'COMPANY/REMOVE_SUCCESS', 'COMPANY/REMOVE_FAILURE')<
  string | undefined,
  undefined,
  string
>();

export const companyActions = {
  fetchCompaniesAsync,
  fetchCompanyAsync,
  addCompanyAsync,
  updateCompanyAsync,
  removeCompanyAsync,
  clearError,
  init,
};

export type CompanyActionType = ActionType<typeof companyActions>;
