import { ThunkAction } from 'redux-thunk';
import api from '@lib/client-api';

import { authActions } from '@lib/store';

import { AppState } from '..';

import { webRequest } from '../webRequest';

import { ErpLogActionType, erpLogActions } from './actions';

export type AppThunk = ThunkAction<Promise<ErpLogActionType>, AppState, null, ErpLogActionType>;

const fetchErpLog = (companyId: string, appSystemId: string): AppThunk => {
  return async (dispatch) => {
    dispatch(erpLogActions.fetchErpLogAsync.request(''));

    const response = await api.erpLog.getErpLog(webRequest(dispatch, authActions), 'erpLog.txt', {
      companyId,
      appSystemId,
    });

    if (response.type === 'GET_ERPLOG') {
      return dispatch(erpLogActions.fetchErpLogAsync.success(response.erpLog));
    }

    return dispatch(erpLogActions.fetchErpLogAsync.failure(response.message));
  };
};

export default { fetchErpLog };
