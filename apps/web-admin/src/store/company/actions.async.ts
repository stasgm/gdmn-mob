import { ThunkAction } from 'redux-thunk';
import { AnyAction, Action } from 'redux';

import { sleep } from '@lib/store';

import { types, requests } from '@lib/client-api';

import { companies } from '@lib/mock';
import { config } from '@lib/client-config';
import { ICompany } from '@lib/types';

import { companyActions } from './actions';
import { ICompanyState } from './types';

const {
  debug: { useMockup: isMock },
} = config;

type AppThunk<R = void, S = ICompanyState, A extends Action = AnyAction> = ThunkAction<R, S, unknown, A>;

const fetchCompanyById = (id: string, onSuccess?: (company?: ICompany) => void): AppThunk => {
  return async (dispatch) => {
    let response: types.company.IGetCompanyResponse | types.error.INetworkError;

    dispatch(companyActions.fetchCompanyAsync.request(''));

    if (isMock) {
      // await sleep(500);
      const company = companies.find((item) => item.id === id);

      if (company) {
        response = { company, type: 'GET_COMPANY' };
      } else {
        response = { message: 'Компания не найдена', type: 'ERROR' };
      }
    } else {
      response = await requests.company.getCompany(id);
    }

    if (response.type === 'GET_COMPANY') {
      dispatch(companyActions.fetchCompanyAsync.success(response.company));
      onSuccess?.(response.company);
      return;
    }

    if (response.type === 'ERROR') {
      dispatch(companyActions.fetchCompanyAsync.failure(response.message));
      onSuccess?.();
      return;
    }

    dispatch(companyActions.fetchCompaniesAsync.failure('something wrong'));
    return;
  };
};

const fetchCompanies = (): AppThunk => {
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
      dispatch(companyActions.fetchCompaniesAsync.success(response.companies));
      return;
    }

    if (response.type === 'ERROR') {
      dispatch(companyActions.fetchCompaniesAsync.failure(response.message));
      return;
    }

    dispatch(companyActions.fetchCompaniesAsync.failure('something wrong'));
    return;
  };
};

const addCompany = (company: ICompany, onSuccess?: (company: ICompany) => void): AppThunk => {
  return async (dispatch) => {
    let response: types.company.IAddCompanyResponse | types.error.INetworkError;

    dispatch(companyActions.addCompanyAsync.request(''));

    if (isMock) {
      await sleep(500);

      if (company.title === '1') {
        // Ошибка добавления компании
        response = { message: 'Компания с таким названием уже существует!', type: 'ERROR' };
      } else {
        // Добаляем компанию
        response = { company, type: 'ADD_COMPANY' };
      }
    } else {
      response = await requests.company.addCompany(company.title, '666');
    }

    if (response.type === 'ADD_COMPANY') {
      dispatch(companyActions.addCompanyAsync.success(response.company));
      onSuccess?.(response.company);
      return;
    }

    if (response.type === 'ERROR') {
      dispatch(companyActions.addCompanyAsync.failure(response.message));
      return;
    }

    dispatch(companyActions.addCompanyAsync.failure('something wrong'));
    return;
  };
};

const updateCompany = (company: ICompany, onSuccess?: (company: ICompany) => void): AppThunk => {
  return async (dispatch) => {
    let response: types.company.IUpdateCompanyResponse | types.error.INetworkError;

    dispatch(companyActions.updateCompanyAsync.request('обновление компании'));

    if (isMock) {
      await sleep(500);

      response = { type: 'UPDATE_COMPANY', company };
    } else {
      response = await requests.company.updateCompany(company);
    }

    if (response.type === 'UPDATE_COMPANY') {
      dispatch(companyActions.updateCompanyAsync.success(response.company));
      onSuccess?.(response.company);
      return;
    }

    if (response.type === 'ERROR') {
      dispatch(companyActions.updateCompanyAsync.failure(response.message));
      return;
    }

    dispatch(companyActions.updateCompanyAsync.failure('something wrong'));
    return;
  };
};

export default { fetchCompanies, fetchCompanyById, addCompany, updateCompany };
