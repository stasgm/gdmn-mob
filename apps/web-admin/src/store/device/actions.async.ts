import api, { types, sleep } from '@lib/client-api';
import { devices, device2 } from '@lib/mock';
import { config } from '@lib/client-config';
import { IDevice, NewDevice } from '@lib/types';

import { ThunkAction } from 'redux-thunk';

import { AppState } from '..';

import { deviceActions, DeviceActionType } from './actions';

const {
  debug: { useMockup: isMock },
  /*   server: { name, port, protocol },
    timeout,
    apiPath, */
} = config;

// const api = new Api({ apiPath, timeout, protocol, port, server: name }, deviceId);

export type AppThunk = ThunkAction<Promise<DeviceActionType>, AppState, null, DeviceActionType>;

const fetchDeviceById = (id: string): AppThunk => {
  return async (dispatch) => {
    let response: types.device.IGetDeviceResponse | types.error.INetworkError;

    dispatch(deviceActions.fetchDeviceAsync.request(''));

    if (isMock) {
      await sleep(1000);
      const device = devices.find((item) => item.id === id);

      if (device) {
        response = { device: { ...device2, id }, type: 'GET_DEVICE' };
      } else {
        response = { message: 'Устройство не найдено', type: 'ERROR' };
      }
    } else {
      response = await api.device.getDevice(id);
    }

    if (response.type === 'GET_DEVICE') {
      return dispatch(deviceActions.fetchDeviceAsync.success(response.device));
    }

    if (response.type === 'ERROR') {
      return dispatch(deviceActions.fetchDeviceAsync.failure(response.message));
    }

    return dispatch(deviceActions.fetchDevicesAsync.failure('something wrong'));
  };
};

const fetchDevices = (): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceActions.fetchDevicesAsync.request(''));

    const response = await api.device.getDevices();

    if (response.type === 'GET_DEVICES') {
      return dispatch(deviceActions.fetchDevicesAsync.success(response.devices));
    }

    if (response.type === 'ERROR') {
      return dispatch(deviceActions.fetchDevicesAsync.failure(response.message));
    }

    return dispatch(deviceActions.fetchDevicesAsync.failure('something wrong'));
  };
};

const addDevice = (device: NewDevice): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceActions.addDeviceAsync.request(''));

    const response = await api.device.addDevice(device);

    if (response.type === 'ADD_DEVICE') {
      return dispatch(deviceActions.addDeviceAsync.success(response.device));
    }

    if (response.type === 'ERROR') {
      return dispatch(deviceActions.addDeviceAsync.failure(response.message));
    }

    return dispatch(deviceActions.addDeviceAsync.failure('something wrong'));
  };
};

const updateDevice = (device: IDevice): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceActions.updateDeviceAsync.request('обновление устройства'));

    const response = await api.device.updateDevice(device);

    if (response.type === 'UPDATE_DEVICE') {
      return dispatch(deviceActions.updateDeviceAsync.success(response.device));
    }

    if (response.type === 'ERROR') {
      return dispatch(deviceActions.updateDeviceAsync.failure(response.message));
    }

    return dispatch(deviceActions.updateDeviceAsync.failure('something wrong'));
  };
};

export default { fetchDevices, fetchDeviceById, addDevice, updateDevice };
