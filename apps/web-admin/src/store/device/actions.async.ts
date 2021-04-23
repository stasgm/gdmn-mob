import { sleep } from '@lib/store';

import Api, { types } from '@lib/client-api';

import { devices, device2 } from '@lib/mock';
import { config } from '@lib/client-config';

import { IDevice, NewDevice } from '@lib/types';

import { AppThunk } from '..';

import { deviceActions } from './actions';

/* const {
  debug: { useMockup: isMock },
} = config; */

const {
  debug: { useMockup: isMock, deviceId },
  server: { name, port, protocol },
  timeout,
  apiPath,
} = config;

const api = new Api({ apiPath, timeout, protocol, port, server: name }, deviceId);

const fetchDeviceById = (id: string, onSuccess?: (device?: IDevice) => void): AppThunk => {
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
      dispatch(deviceActions.fetchDeviceAsync.success(response.device));
      onSuccess?.(response.device);
      return;
    }

    if (response.type === 'ERROR') {
      dispatch(deviceActions.fetchDeviceAsync.failure(response.message));
      onSuccess?.();
      return;
    }

    dispatch(deviceActions.fetchDevicesAsync.failure('something wrong'));
    return;
  };
};

const fetchDevices = (): AppThunk => {
  return async (dispatch) => {
    let response: types.device.IGetDevicesResponse | types.error.INetworkError;

    dispatch(deviceActions.fetchDevicesAsync.request(''));

    if (isMock) {
      await sleep(500);

      response = { devices: devices, type: 'GET_DEVICES' };
      // response = { message: 'device not found', type: 'ERROR' };
    } else {
      response = await api.device.getDevices();
    }

    if (response.type === 'GET_DEVICES') {
      dispatch(deviceActions.fetchDevicesAsync.success(response.devices));
      return;
    }

    if (response.type === 'ERROR') {
      dispatch(deviceActions.fetchDevicesAsync.failure(response.message));
      return;
    }

    dispatch(deviceActions.fetchDevicesAsync.failure('something wrong'));
    return;
  };
};

const addDevice = (device: NewDevice, onSuccess?: (device: IDevice) => void): AppThunk => {
  return async (dispatch) => {
    let response: types.device.IAddDeviceResponse | types.error.INetworkError;

    dispatch(deviceActions.addDeviceAsync.request(''));

    if (isMock) {
      // await sleep(500);

      if (device.name === '1') {
        // Ошибка добавления пользователя
        response = { message: 'Пользователь с таким логином уже существует!', type: 'ERROR' };
      } else {
        // Добаляем пользователя
        response = { device: { ...device, ...device2 }, type: 'ADD_DEVICE' };
      }
    } else {
      response = await api.device.addDevice(device);
    }

    if (response.type === 'ADD_DEVICE') {
      dispatch(deviceActions.addDeviceAsync.success(response.device));
      onSuccess?.(response.device);
      return;
    }

    if (response.type === 'ERROR') {
      dispatch(deviceActions.addDeviceAsync.failure(response.message));
      return;
    }

    dispatch(deviceActions.addDeviceAsync.failure('something wrong'));
    return;
  };
};

const updateDevice = (device: IDevice, onSuccess?: (device: IDevice) => void): AppThunk => {
  return async (dispatch) => {
    let response: types.device.IUpdateDeviceResponse | types.error.INetworkError;

    dispatch(deviceActions.updateDeviceAsync.request('обновление компании'));

    if (isMock) {
      await sleep(500);

      response = { type: 'UPDATE_DEVICE', device };
    } else {
      response = await api.device.updateDevice(device);
    }

    if (response.type === 'UPDATE_DEVICE') {
      dispatch(deviceActions.updateDeviceAsync.success(response.device));
      onSuccess?.(response.device);
      return;
    }

    if (response.type === 'ERROR') {
      dispatch(deviceActions.updateDeviceAsync.failure(response.message));
      return;
    }

    dispatch(deviceActions.updateDeviceAsync.failure('something wrong'));
    return;
  };
};

export default { fetchDevices, fetchDeviceById, addDevice, updateDevice };
