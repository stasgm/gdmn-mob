import { IDeviceBinding } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('DEVICEBINDING/INIT')();
const clearError = createAction('DEVICEBINDING/CLEAR_ERROR')();

const fetchDeviceBindingsAsync = createAsyncAction(
  'DEVICEBINDING/FETCH_DEVICEBINDINGS',
  'DEVICEBINDING/FETCH_DEVICEBINDINGS_SUCCCES',
  'DEVICEBINDING/FETCH_DEVICEBINDINGS_FAILURE',
)<string | undefined, IDeviceBinding[], string>();

const fetchDeviceBindingAsync = createAsyncAction(
  'DEVICEBINDING/FETCH_DEVICEBINDING',
  'DEVICEBINDING/FETCH_DEVICEBINDING_SUCCCES',
  'DEVICEBINDING/FETCH_DEVICEBINDING_FAILURE',
)<string | undefined, IDeviceBinding, string>();

const addDeviceBindingAsync = createAsyncAction(
  'DEVICEBINDING/ADD',
  'DEVICEBINDING/ADD_SUCCCES',
  'DEVICEBINDING/ADD_FAILURE',
)<string | undefined, IDeviceBinding, string>();

const updateDeviceBindingAsync = createAsyncAction(
  'DEVICEBINDING/UPDATE',
  'DEVICEBINDING/UPDATE_SUCCCES',
  'DEVICEBINDING/UPDATE_FAILURE',
)<string | undefined, IDeviceBinding, string>();

const removeDeviceBindingAsync = createAsyncAction(
  'DEVICEBINDING/REMOVE',
  'DEVICEBINDING/REMOVE_SUCCCES',
  'DEVICEBINDING/REMOVE_FAILURE',
)<string | undefined, undefined, string>();

export const deviceBindingActions = {
  fetchDeviceBindingsAsync,
  fetchDeviceBindingAsync,
  addDeviceBindingAsync,
  updateDeviceBindingAsync,
  removeDeviceBindingAsync,
  clearError,
  init,
};

export type DeviceBindingActionType = ActionType<typeof deviceBindingActions>;
