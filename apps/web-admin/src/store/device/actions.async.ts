import api from '@lib/client-api';
import { IDevice, NewDevice } from '@lib/types';

import { ThunkAction } from 'redux-thunk';

import { AppState } from '..';

import { deviceActions, DeviceActionType } from './actions';

export type AppThunk = ThunkAction<Promise<DeviceActionType>, AppState, null, DeviceActionType>;

const fetchDeviceById = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceActions.fetchDeviceAsync.request(''));

    const response = await api.device.getDevice(id);

    if (response.type === 'GET_DEVICE') {
      return dispatch(deviceActions.fetchDeviceAsync.success(response.device));
    }

    if (response.type === 'ERROR') {
      return dispatch(deviceActions.fetchDeviceAsync.failure(response.message));
    }

    return dispatch(deviceActions.fetchDevicesAsync.failure('Ошибка получения данных об устройстве'));
  };
};

const fetchDevices = (filterText?: string, fromRecord?: number, toRecord?: number): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceActions.fetchDevicesAsync.request(''));

    const params: Record<string, string | number> = {};

    if (filterText) params.filterText = filterText;
    if (fromRecord) params.fromRecord = fromRecord;
    if (toRecord) params.toRecord = toRecord;

    const response = await api.device.getDevices(params);

    if (response.type === 'GET_DEVICES') {
      return dispatch(deviceActions.fetchDevicesAsync.success(response.devices));
    }

    if (response.type === 'ERROR') {
      return dispatch(deviceActions.fetchDevicesAsync.failure(response.message));
    }

    return dispatch(deviceActions.fetchDevicesAsync.failure('Ошибка получения данных об устройствах'));
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

    return dispatch(deviceActions.addDeviceAsync.failure('Ошибка добавления устройства'));
  };
};

const updateDevice = (device: IDevice): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceActions.updateDeviceAsync.request('Обновление устройства'));

    const response = await api.device.updateDevice(device);

    if (response.type === 'UPDATE_DEVICE') {
      return dispatch(deviceActions.updateDeviceAsync.success(response.device));
    }

    if (response.type === 'ERROR') {
      return dispatch(deviceActions.updateDeviceAsync.failure(response.message));
    }

    return dispatch(deviceActions.updateDeviceAsync.failure('Ошибка обновления устройства'));
  };
};

const removeDevice = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceActions.removeDeviceAsync.request('Удаление устройства'));

    const response = await api.device.removeDevice(id);

    if (response.type === 'REMOVE_DEVICE') {
      return dispatch(deviceActions.removeDeviceAsync.success());
    }

    if (response.type === 'ERROR') {
      return dispatch(deviceActions.removeDeviceAsync.failure(response.message));
    }

    return dispatch(deviceActions.removeDeviceAsync.failure('Ошибка удаления устройства'));
  };
};

export default { fetchDevices, fetchDeviceById, addDevice, updateDevice, removeDevice };
