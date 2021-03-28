import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { IUserCredentials } from '@lib/types';

import { requests } from '@lib/client-api';

import { IGetDeviceResponse } from '@lib/client-api/src/types/device';

import { INetworkError } from '@lib/client-api/src/types';

import { device, user } from '../../../mock';

import { sleep } from '../../utils/tools';

import { authActions } from './actions';
import { DevicePayload, IAuthState, UserPayload } from './types';

const isMock = false;

const checkDevice = (): ThunkAction<void, IAuthState, unknown, AnyAction> => {
  return async (dispatch) => {
    let response: IGetDeviceResponse | INetworkError;

    dispatch(authActions.checkDeviceAsync.request(''));

    if (isMock) {
      await sleep(1000);
      response = { device: device, type: 'GET_DEVICE' };
    } else {
      response = await requests.device.getDevice(device.uid);
    }

    if (response.type === 'GET_DEVICE') {
      return dispatch(authActions.checkDeviceAsync.success(response.device));
    }

    if (response.type === 'ERROR') {
      return dispatch(authActions.checkDeviceAsync.failure(response.message));
    }

    return dispatch(authActions.checkDeviceAsync.failure('something wrong'));
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
