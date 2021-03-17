import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { IUserCredentials } from '@lib/common-types';

import { device, user } from '../../mock';

import { authActions } from './actions';
import { DevicePayload, IAuthState, UserPayload } from './types';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const checkDevice = (): ThunkAction<void, IAuthState, unknown, AnyAction> => {
  return async dispatch => {
    const response: DevicePayload = { deviceData: device };

    dispatch(authActions.checkDeviceAsync.request('', ''));

    await sleep(1000);

    if (response.deviceData) {
      return dispatch(authActions.checkDeviceAsync.success(response.deviceData));
    }

    return dispatch(authActions.checkDeviceAsync.failure('device does not exist'));
  };
};

const signIn = (credentials: IUserCredentials): ThunkAction<void, IAuthState, unknown, AnyAction> => {
  return async dispatch => {
    let response: UserPayload;

    dispatch(authActions.loginUserAsync.request(''));

    await sleep(1000);

    if (credentials.userName === 'Stas') {
      if (credentials.password === '123') {
        response = {
          userData: user,
        };

        if (response.userData) {
          console.log('userData', response.userData);
          return dispatch(authActions.loginUserAsync.success(response.userData));
        }

        return dispatch(authActions.loginUserAsync.failure(response?.errorMessage || 'чт-то не так'));
      }
      return dispatch(authActions.loginUserAsync.failure('wrong password'));
    }
    return dispatch(authActions.loginUserAsync.failure('user does not exist'));
  };
};

export default { checkDevice, signIn };
