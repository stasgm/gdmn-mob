import api, { CustomRequest } from '@lib/client-api';
import { authActions } from '@lib/store';
import { IDevice, NewDevice } from '@lib/types';

import { ThunkAction } from 'redux-thunk';

import { AppState } from '..';
import { webRequest } from '../webRequest';

import { deviceActions, DeviceActionType } from './actions';

export type AppThunk = ThunkAction<Promise<DeviceActionType>, AppState, null, DeviceActionType>;

const fetchDeviceById = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceActions.fetchDeviceAsync.request(''));

    const response = await api.device.getDevice(webRequest(dispatch, authActions), id);

    if (response.type === 'GET_DEVICE') {
      return dispatch(deviceActions.fetchDeviceAsync.success(response.device));
    }

    return dispatch(deviceActions.fetchDeviceAsync.failure(response.message));
  };
};

const fetchDevices = (filterText?: string, fromRecord?: number, toRecord?: number): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceActions.fetchDevicesAsync.request(''));

    const params: Record<string, string | number> = {};

    if (filterText) params.filterText = filterText;
    if (fromRecord) params.fromRecord = fromRecord;
    if (toRecord) params.toRecord = toRecord;

    const response = await api.device.getDevices(webRequest(dispatch, authActions), params);

    if (response.type === 'GET_DEVICES') {
      return dispatch(deviceActions.fetchDevicesAsync.success(response.devices));
    }

    return dispatch(deviceActions.fetchDevicesAsync.failure(response.message));
  };
};

const addDevice = (device: NewDevice): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceActions.addDeviceAsync.request(''));

    const response = await api.device.addDevice(webRequest(dispatch, authActions), device);

    if (response.type === 'ADD_DEVICE') {
      return dispatch(deviceActions.addDeviceAsync.success(response.device));
    }

    return dispatch(deviceActions.addDeviceAsync.failure(response.message));
  };
};

const updateDevice = (device: IDevice): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceActions.updateDeviceAsync.request('Обновление устройства'));

    const response = await api.device.updateDevice(webRequest(dispatch, authActions), device);

    if (response.type === 'UPDATE_DEVICE') {
      return dispatch(deviceActions.updateDeviceAsync.success(response.device));
    }

    return dispatch(deviceActions.updateDeviceAsync.failure(response.message));
  };
};

const removeDevice = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceActions.removeDeviceAsync.request('Удаление устройства'));

    const response = await api.device.removeDevice(webRequest(dispatch, authActions), id);

    if (response.type === 'REMOVE_DEVICE') {
      return dispatch(deviceActions.removeDeviceAsync.success(id));
    }

    return dispatch(deviceActions.removeDeviceAsync.failure(response.message));
  };
};

export default { fetchDevices, fetchDeviceById, addDevice, updateDevice, removeDevice };
