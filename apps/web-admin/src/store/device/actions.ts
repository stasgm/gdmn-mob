import { IDevice } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('DEVICE/INIT')();
const clearError = createAction('DEVICE/CLEAR_ERROR')();

const fetchDevicesAsync = createAsyncAction(
  'DEVICE/FETCH_DEVICES',
  'DEVICE/FETCH_DEVICES_SUCCESS',
  'DEVICE/FETCH_DEVICES_FAILURE',
)<string | undefined, IDevice[], string>();

const fetchDeviceAsync = createAsyncAction(
  'DEVICE/FETCH_DEVICE',
  'DEVICE/FETCH_DEVICE_SUCCESS',
  'DEVICE/FETCH_DEVICE_FAILURE',
)<string | undefined, IDevice, string>();

const addDeviceAsync = createAsyncAction('DEVICE/ADD', 'DEVICE/ADD_SUCCESS', 'DEVICE/ADD_FAILURE')<
  string | undefined,
  IDevice,
  string
>();

const updateDeviceAsync = createAsyncAction('DEVICE/UPDATE', 'DEVICE/UPDATE_SUCCESS', 'DEVICE/UPDATE_FAILURE')<
  string | undefined,
  IDevice,
  string
>();

const removeDeviceAsync = createAsyncAction('DEVICE/REMOVE', 'DEVICE/REMOVE_SUCCESS', 'DEVICE/REMOVE_FAILURE')<
  string | undefined,
  string,
  string
>();

export const deviceActions = {
  fetchDevicesAsync,
  fetchDeviceAsync,
  addDeviceAsync,
  updateDeviceAsync,
  removeDeviceAsync,
  clearError,
  init,
};

export type DeviceActionType = ActionType<typeof deviceActions>;
