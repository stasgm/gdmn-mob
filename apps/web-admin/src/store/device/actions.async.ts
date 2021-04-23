import Api from '@lib/client-api';
import { config } from '@lib/client-config';
import { IDevice, NewDevice } from '@lib/types';

import { AppThunk } from '..';

import { deviceActions } from './actions';

const {
  debug: { deviceId },
  server: { name, port, protocol },
  timeout,
  apiPath,
} = config;

const api = new Api({ apiPath, timeout, protocol, port, server: name }, deviceId);

const fetchDeviceById = (id: string, onSuccess?: (device?: IDevice) => void): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceActions.fetchDeviceAsync.request(''));

    const response = await api.device.getDevice(id);

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
    dispatch(deviceActions.fetchDevicesAsync.request(''));

    const response = await api.device.getDevices();

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
    dispatch(deviceActions.addDeviceAsync.request(''));

    const response = await api.device.addDevice(device);

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
    dispatch(deviceActions.updateDeviceAsync.request('обновление компании'));

    const response = await api.device.updateDevice(device);

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
