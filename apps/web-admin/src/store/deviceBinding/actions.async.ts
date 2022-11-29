import api from '@lib/client-api';
import { authActions } from '@lib/store';
import { IDeviceBinding, NewDeviceBinding } from '@lib/types';

import { ThunkAction } from 'redux-thunk';

import { AppState } from '..';
import { webRequest } from '../webRequest';

import { deviceBindingActions, DeviceBindingActionType } from './actions';

export type AppThunk = ThunkAction<Promise<DeviceBindingActionType>, AppState, null, DeviceBindingActionType>;

const fetchDeviceBindings = (
  userId?: string,
  filterText?: string,
  fromRecord?: number,
  toRecord?: number,
): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceBindingActions.fetchDeviceBindingsAsync.request(''));

    const params: Record<string, string | number> = {};
    if (userId) params.userId = userId;
    if (filterText) params.filterText = filterText;
    if (fromRecord) params.fromRecord = fromRecord;
    if (toRecord) params.toRecord = toRecord;

    const response = await api.deviceBinding.getDeviceBindings(webRequest(dispatch, authActions), params);

    if (response.type === 'GET_DEVICEBINDINGS') {
      return dispatch(deviceBindingActions.fetchDeviceBindingsAsync.success(response.deviceBindings));
    }

    return dispatch(deviceBindingActions.fetchDeviceBindingsAsync.failure(response.message));
  };
};

const fetchDeviceBindingById = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceBindingActions.fetchDeviceBindingAsync.request(''));

    const response = await api.deviceBinding.getDeviceBinding(webRequest(dispatch, authActions), id);

    if (response.type === 'GET_DEVICEBINDING') {
      return dispatch(deviceBindingActions.fetchDeviceBindingAsync.success(response.deviceBinding));
    }

    return dispatch(deviceBindingActions.fetchDeviceBindingAsync.failure(response.message));
  };
};

const addDeviceBinding = (deviceBinding: NewDeviceBinding): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceBindingActions.addDeviceBindingAsync.request(''));

    const response = await api.deviceBinding.addDeviceBinding(deviceBinding);

    if (response.type === 'ADD_DEVICEBINDING') {
      return dispatch(deviceBindingActions.addDeviceBindingAsync.success(response.deviceBinding));
    }

    return dispatch(deviceBindingActions.addDeviceBindingAsync.failure(response.message));
  };
};

const updateDeviceBinding = (deviceBinding: IDeviceBinding): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceBindingActions.updateDeviceBindingAsync.request('Обновление устройства'));

    const response = await api.deviceBinding.updateDeviceBinding(deviceBinding);

    if (response.type === 'UPDATE_DEVICEBINDING') {
      return dispatch(deviceBindingActions.updateDeviceBindingAsync.success(response.deviceBinding));
    }

    return dispatch(deviceBindingActions.updateDeviceBindingAsync.failure(response.message));
  };
};

const removeDeviceBinding = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceBindingActions.removeDeviceBindingAsync.request('Удаление связи устройства с пользователем'));

    const response = await api.deviceBinding.removeDeviceBinding(id);

    if (response.type === 'REMOVE_DEVICEBINDING') {
      return dispatch(deviceBindingActions.removeDeviceBindingAsync.success());
    }

    return dispatch(deviceBindingActions.removeDeviceBindingAsync.failure(response.message));
  };
};

export default {
  fetchDeviceBindings,
  fetchDeviceBindingById,
  addDeviceBinding,
  updateDeviceBinding,
  removeDeviceBinding,
};
