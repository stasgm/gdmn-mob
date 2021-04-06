import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { sleep } from '@lib/store';

import { types, requests } from '@lib/client-api';

import { companies } from '@lib/mock';

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

export default { fetchCompanies };
