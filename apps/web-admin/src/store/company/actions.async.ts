import { ThunkAction } from 'redux-thunk';
import api from '@lib/client-api';

import { NewCompany, ICompany } from '@lib/types';

import { AppState } from '../';

import { companyActions, CompanyActionType } from './actions';

export type AppThunk = ThunkAction<Promise<CompanyActionType>, AppState, null, CompanyActionType>;

const fetchCompanyById = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(companyActions.fetchCompanyAsync.request(''));

    const response = await api.company.getCompany(id);

    if (response.type === 'GET_COMPANY') {
      return dispatch(companyActions.fetchCompanyAsync.success(response.company));
    }

    return dispatch(companyActions.fetchCompanyAsync.failure(response.message));
  };
};

const fetchCompanies = (filterText?: string, fromRecord?: number, toRecord?: number): AppThunk => {
  return async (dispatch) => {
    dispatch(companyActions.fetchCompaniesAsync.request(''));

    const params: Record<string, string | number> = {};

    if (filterText) params.filterText = filterText;
    if (fromRecord) params.fromRecord = fromRecord;
    if (toRecord) params.toRecord = toRecord;

    const response = await api.company.getCompanies(params);

    if (response.type === 'GET_COMPANIES') {
      return dispatch(companyActions.fetchCompaniesAsync.success(response.companies));
    }

    return dispatch(companyActions.fetchCompaniesAsync.failure(response.message));
  };
};

const addCompany = (company: NewCompany): AppThunk => {
  return async (dispatch) => {
    dispatch(companyActions.addCompanyAsync.request(''));

    const response = await api.company.addCompany(company);

    if (response.type === 'ADD_COMPANY') {
      return dispatch(companyActions.addCompanyAsync.success(response.company));
    }

    return dispatch(companyActions.addCompanyAsync.failure(response.message));
  };
};

const updateCompany = (company: ICompany): AppThunk => {
  return async (dispatch) => {
    dispatch(companyActions.updateCompanyAsync.request('Обновление компании'));

    const response = await api.company.updateCompany(company);

    if (response.type === 'UPDATE_COMPANY') {
      return dispatch(companyActions.updateCompanyAsync.success(response.company));
    }

    return dispatch(companyActions.updateCompanyAsync.failure(response.message));
  };
};

const removeCompany = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(companyActions.removeCompanyAsync.request('Удаление компании'));

    const response = await api.company.removeCompany(id);

    if (response.type === 'REMOVE_COMPANY') {
      return dispatch(companyActions.removeCompanyAsync.success(id));
    }

    return dispatch(companyActions.removeCompanyAsync.failure(response.message));
  };
};

export default { fetchCompanies, fetchCompanyById, addCompany, updateCompany, removeCompany };
