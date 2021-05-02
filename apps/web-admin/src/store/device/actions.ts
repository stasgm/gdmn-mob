import { IDevice } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('DEVICE/INIT')();
const clearError = createAction('DEVICE/CLEAR_ERROR')();

const fetchDevicesAsync = createAsyncAction(
  'DEVICE/FETCH_DEVICES',
  'DEVICE/FETCH_DEVICES_SUCCCES',
  'DEVICE/FETCH_DEVICES_FAILURE',
)<string | undefined, IDevice[], string>();

const fetchDeviceAsync = createAsyncAction(
  'DEVICE/FETCH_DEVICE',
  'DEVICE/FETCH_DEVICE_SUCCCES',
  'DEVICE/FETCH_DEVICE_FAILURE',
)<string | undefined, IDevice, string>();

const addDeviceAsync = createAsyncAction('DEVICE/ADD', 'DEVICE/ADD_SUCCCES', 'DEVICE/ADD_FAILURE')<
  string | undefined,
  IDevice,
  string
>();

const updateDeviceAsync = createAsyncAction('DEVICE/UPDATE', 'DEVICE/UPDATE_SUCCCES', 'DEVICE/UPDATE_FAILURE')<
  string | undefined,
  IDevice,
  string
>();

export const deviceActions = {
  fetchDevicesAsync,
  fetchDeviceAsync,
  addDeviceAsync,
  updateDeviceAsync,
  clearError,
  init,
};

export type DeviceActionType = ActionType<typeof deviceActions>;
