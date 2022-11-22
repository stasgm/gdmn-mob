import api from '@lib/client-api';

import { ThunkAction } from 'redux-thunk';

import { AppState } from '..';

import { activationCodeActions, ActivationCodeActionType } from './actions';

export type AppThunk = ThunkAction<Promise<ActivationCodeActionType>, AppState, null, ActivationCodeActionType>;

const fetchActivationCodes = (deviceId?: string): AppThunk => {
  return async (dispatch) => {
    dispatch(activationCodeActions.fetchCodesAsync.request(''));

    const response = await api.activationCode.getActivationCodes(deviceId ? { deviceId: deviceId } : undefined);

    if (response.type === 'GET_CODES') {
      return dispatch(activationCodeActions.fetchCodesAsync.success(response.codes));
    }

    return dispatch(activationCodeActions.fetchCodesAsync.failure(response.message));
  };
};

/*CREATE*/

const createActivationCode = (deviceId: string): AppThunk => {
  return async (dispatch) => {
    dispatch(activationCodeActions.createCodeAsync.request(''));

    const response = await api.activationCode.createActivationCode(deviceId);

    if (response.type === 'CREATE_CODE') {
      return dispatch(activationCodeActions.createCodeAsync.success(response.code));
    }

    return dispatch(activationCodeActions.createCodeAsync.failure(response.message));
  };
};

export default { fetchActivationCodes, createActivationCode };
