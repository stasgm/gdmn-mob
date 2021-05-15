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

    if (response.type === 'ERROR') {
      return dispatch(companyActions.fetchCompanyAsync.failure(response.message));
    }

    return dispatch(companyActions.fetchCompaniesAsync.failure('Oops, Something Went Wrong'));
  };
};

const fetchCompanies = (): AppThunk => {
  return async (dispatch) => {
    dispatch(companyActions.fetchCompaniesAsync.request(''));
    const response = await api.company.getCompanies();

    if (response.type === 'GET_COMPANIES') {
      return dispatch(companyActions.fetchCompaniesAsync.success(response.companies));
    }

    if (response.type === 'ERROR') {
      return dispatch(companyActions.fetchCompaniesAsync.failure(response.message));
    }

    return dispatch(companyActions.fetchCompaniesAsync.failure('Oops, Something Went Wrong'));
  };
};

const addCompany = (company: NewCompany): AppThunk => {
  return async (dispatch) => {
    dispatch(companyActions.addCompanyAsync.request(''));

    const response = await api.company.addCompany(company);

    if (response.type === 'ADD_COMPANY') {
      return dispatch(companyActions.addCompanyAsync.success(response.company));
    }

    if (response.type === 'ERROR') {
      return dispatch(companyActions.addCompanyAsync.failure(response.message));
    }

    return dispatch(companyActions.addCompanyAsync.failure('Oops, Something Went Wrong'));
  };
};

const updateCompany = (company: ICompany): AppThunk => {
  return async (dispatch) => {
    dispatch(companyActions.updateCompanyAsync.request('обновление компании'));

    const response = await api.company.updateCompany(company);

    if (response.type === 'UPDATE_COMPANY') {
      return dispatch(companyActions.updateCompanyAsync.success(response.company));
    }

    if (response.type === 'ERROR') {
      return dispatch(companyActions.updateCompanyAsync.failure(response.message));
    }

    return dispatch(companyActions.updateCompanyAsync.failure('Oops, Something Went Wrong'));
  };
};

export default { fetchCompanies, fetchCompanyById, addCompany, updateCompany };
