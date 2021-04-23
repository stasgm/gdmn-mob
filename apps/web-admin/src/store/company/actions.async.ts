import Api from '@lib/client-api';
import { config } from '@lib/client-config';

import { NewCompany, ICompany } from '@lib/types';

import { AppThunk } from '../';

import { companyActions } from './actions';

const {
  debug: { deviceId },
  server: { name, port, protocol },
  timeout,
  apiPath,
} = config;

const api = new Api({ apiPath, timeout, protocol, port, server: name }, deviceId);

const fetchCompanyById = (id: string, onSuccess?: (company?: ICompany) => void): AppThunk => {
  return async (dispatch) => {
    dispatch(companyActions.fetchCompanyAsync.request(''));

    const response = await api.company.getCompany(id);

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
    dispatch(companyActions.fetchCompaniesAsync.request(''));

    const response = await api.company.getCompanies();

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

const addCompany = (company: NewCompany, onSuccess?: (company: ICompany) => void): AppThunk => {
  return async (dispatch) => {
    dispatch(companyActions.addCompanyAsync.request(''));

    const response = await api.company.addCompany(company);

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
    dispatch(companyActions.updateCompanyAsync.request('обновление компании'));

    const response = await api.company.updateCompany(company);

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
