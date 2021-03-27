import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { IUserCredentials } from '@lib/types';

import { device, user } from '../../mock';

import { authActions } from './actions';
import { DevicePayload, IAuthState, UserPayload } from './types';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const checkDevice = (): ThunkAction<void, IAuthState, unknown, AnyAction> => {
  return async (dispatch) => {
    let response: DevicePayload = { deviceData: device };

    dispatch(authActions.checkDeviceAsync.request(''));

    await sleep(1000);

    response = { deviceData: null, errorMessage: 'something wrong' };

    if (response.deviceData) {
      return dispatch(authActions.checkDeviceAsync.success(response.deviceData));
    }

    if (response.deviceData === null) {
      return dispatch(authActions.checkDeviceAsync.success(response.deviceData));
    }

    return dispatch(authActions.checkDeviceAsync.failure(response.errorMessage || 'device does not exist'));
  };
};

const activateDevice = (code: string): ThunkAction<void, IAuthState, unknown, AnyAction> => {
  return async (dispatch) => {
    let response: DevicePayload;

    dispatch(authActions.activateDeviceAsync.request(''));

    await sleep(1000);
    console.log('code', code);

    if (code === '1234') {
      response = {
        deviceData: device,
      };

      if (response.deviceData) {
        return dispatch(authActions.activateDeviceAsync.success(response.deviceData));
      }

      return dispatch(authActions.activateDeviceAsync.failure('device does not exist'));
    }
    return dispatch(authActions.activateDeviceAsync.failure('wrong code'));
  };
};

const signIn = (credentials: IUserCredentials): ThunkAction<void, IAuthState, unknown, AnyAction> => {
  return async (dispatch) => {
    let response: UserPayload;

    dispatch(authActions.loginUserAsync.request(''));

    await sleep(1000); // Запрос к серверу

    if (credentials.userName === 'Stas') {
      if (credentials.password === '123') {
        response = {
          userData: user,
        };

        if (response.userData) {
          return dispatch(authActions.loginUserAsync.success(response.userData));
        }

        return dispatch(authActions.loginUserAsync.failure(response?.errorMessage || 'чт-то не так'));
      }
      return dispatch(authActions.loginUserAsync.failure('wrong password'));
    }
    return dispatch(authActions.loginUserAsync.failure('user does not exist'));
  };
};

export default { checkDevice, activateDevice, signIn };
