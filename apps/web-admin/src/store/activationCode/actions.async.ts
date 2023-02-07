import api from '@lib/client-api';
import { authActions } from '@lib/store';

import { ThunkAction } from 'redux-thunk';

import { AppState } from '..';
import { webRequest } from '../webRequest';

import { activationCodeActions, ActivationCodeActionType } from './actions';

export type AppThunk = ThunkAction<Promise<ActivationCodeActionType>, AppState, null, ActivationCodeActionType>;

const fetchActivationCodes = (deviceId?: string): AppThunk => {
  return async (dispatch) => {
    dispatch(activationCodeActions.fetchCodesAsync.request(''));

    const response = await api.activationCode.getActivationCodes(
      webRequest(dispatch, authActions),
      deviceId ? { deviceId: deviceId } : undefined,
    );

    if (response.type === 'GET_CODES') {
      return dispatch(activationCodeActions.fetchCodesAsync.success(response.codes));
    }

    return dispatch(activationCodeActions.fetchCodesAsync.failure(response.message));
  };
};

const createActivationCode = (deviceId: string): AppThunk => {
  return async (dispatch) => {
    dispatch(activationCodeActions.createCodeAsync.request(''));

    const response = await api.activationCode.createActivationCode(webRequest(dispatch, authActions), deviceId);

    if (response.type === 'CREATE_CODE') {
      return dispatch(activationCodeActions.createCodeAsync.success(response.code));
    }

    return dispatch(activationCodeActions.createCodeAsync.failure(response.message));
  };
};

export default { fetchActivationCodes, createActivationCode };
