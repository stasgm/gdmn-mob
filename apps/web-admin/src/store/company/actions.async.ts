import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { sleep } from '@lib/store';

import { types, requests } from '@lib/client-api';

import { companies } from '@lib/mock';

import { ICompany } from '@lib/types';

import { companyActions } from './actions';
import { ICompanyState } from './types';

const isMock = true; // TODO брать из конфига

const fetchCompanies = (): ThunkAction<void, ICompanyState, unknown, AnyAction> => {
  return async (dispatch) => {
    let response: types.company.IGetCompaniesResponse | types.error.INetworkError;

    dispatch(companyActions.fetchCompaniesAsync.request(''));

    if (isMock) {
      await sleep(500);

      response = { companies, type: 'GET_COMPANIES' };
      // response = { message: 'device not found', type: 'ERROR' };
    } else {
      response = await requests.company.getCompanies();
    }

    if (response.type === 'GET_COMPANIES') {
      return dispatch(companyActions.fetchCompaniesAsync.success(response.companies));
    }

    if (response.type === 'ERROR') {
      return dispatch(companyActions.fetchCompaniesAsync.failure(response.message));
    }

    return dispatch(companyActions.fetchCompaniesAsync.failure('something wrong'));
  };
};

const addCompany = (companyName: string): ThunkAction<void, ICompanyState, unknown, AnyAction> => {
  return async (dispatch) => {
    let response: types.company.IAddCompanyResponse | types.error.INetworkError;

    dispatch(companyActions.addCompanyAsync.request(''));

    if (isMock) {
      await sleep(500);

      response = { companyId: '666', type: 'ADD_COMPANY' };
    } else {
      response = await requests.company.addCompany(companyName, '666');
    }

    if (response.type === 'ADD_COMPANY') {
      return dispatch(companyActions.addCompanyAsync.success(response.companyId));
    }

    if (response.type === 'ERROR') {
      return dispatch(companyActions.addCompanyAsync.failure(response.message));
    }

    return dispatch(companyActions.addCompanyAsync.failure('something wrong'));
  };
};

const updateCompany = (company: ICompany): ThunkAction<void, ICompanyState, unknown, AnyAction> => {
  return async (dispatch) => {
    let response: types.company.IUpdateCompanyResponse | types.error.INetworkError;

    dispatch(companyActions.updateCompanyAsync.request(''));

    if (isMock) {
      await sleep(500);

      response = { type: 'UPDATE_COMPANY' };
    } else {
      response = await requests.company.updateCompany(company);
    }

    if (response.type === 'UPDATE_COMPANY') {
      return dispatch(companyActions.updateCompanyAsync.success());
    }

    if (response.type === 'ERROR') {
      return dispatch(companyActions.updateCompanyAsync.failure(response.message));
    }

    return dispatch(companyActions.updateCompanyAsync.failure('something wrong'));
  };
};

export default { fetchCompanies, addCompany, updateCompany };
