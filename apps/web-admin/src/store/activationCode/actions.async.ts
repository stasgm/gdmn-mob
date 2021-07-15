import api from '@lib/client-api';
import { IActivationCode, NewActivationCode } from '@lib/types';

import { ThunkAction } from 'redux-thunk';

import { AppState } from '..';

import { activationCodeActions, ActivationCodeActionType } from './actions';

export type AppThunk = ThunkAction<Promise<ActivationCodeActionType>, AppState, null, ActivationCodeActionType>;

/*const fetchActivationCodeById = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(activationCodeActions.fetchActivationCodeAsync.request(''));

    const response = await api.activationCode.getDevice(id);

    if (response.type === 'GET_DEVICE') {
      return dispatch(activationCodeActions.fetchActivationCodeAsync.success(response.activationCode));
    }

    if (response.type === 'ERROR') {
      return dispatch(activationCodeActions.fetchActivationCodeAsync.failure(response.message));
    }

    return dispatch(activationCodeActions.fetchActivationCodesAsync.failure('Ошибка получения данных об устройстве'));
  };
};*/

const fetchActivationCodes = (): AppThunk => {
  return async (dispatch) => {
    dispatch(activationCodeActions.fetchActivationCodeAsync.request(''));

    const response = await api.activationCode.getActivationCodes();

    if (response.type === 'GET_ACTIVATION_CODES') {
      return dispatch(activationCodeActions.fetchActivationCodesAsync.success(response.activationCodes));
    }

    if (response.type === 'ERROR') {
      return dispatch(activationCodeActions.fetchActivationCodesAsync.failure(response.message));
    }

    return dispatch(activationCodeActions.fetchActivationCodesAsync.failure('Ошибка получения данных об устройствах'));
  };
};



export default { fetchActivationCodes };
