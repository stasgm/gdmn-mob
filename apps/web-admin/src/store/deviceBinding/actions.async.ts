import api from '@lib/client-api';
import { IDeviceBinding, NewDeviceBinding } from '@lib/types';

import { ThunkAction } from 'redux-thunk';

import { AppState } from '..';

import { deviceBindingActions, DeviceBindingActionType } from './actions';

export type AppThunk = ThunkAction<Promise<DeviceBindingActionType>, AppState, null, DeviceBindingActionType>;

const fetchDeviceBindingById = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceBindingActions.fetchDeviceBindingAsync.request(''));

    const response = await api.deviceBinding.getDeviceBinding(id);

    if (response.type === 'GET_DEVICEBINDING') {
      return dispatch(deviceBindingActions.fetchDeviceBindingAsync.success(response.deviceBinding));
    }

    if (response.type === 'ERROR') {
      return dispatch(deviceBindingActions.fetchDeviceBindingAsync.failure(response.message));
    }

    return dispatch(
      deviceBindingActions.fetchDeviceBindingsAsync.failure('Ошибка получения данных связи устройства с пользователем'),
    );
  };
};

const fetchDeviceBindings = (userId?: string): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceBindingActions.fetchDeviceBindingsAsync.request(''));

    const response = await api.deviceBinding.getDeviceBindings(userId ? { userId: userId } : undefined);

    if (response.type === 'GET_DEVICEBINDINGS') {
      return dispatch(deviceBindingActions.fetchDeviceBindingsAsync.success(response.deviceBindings));
    }

    if (response.type === 'ERROR') {
      return dispatch(deviceBindingActions.fetchDeviceBindingsAsync.failure(response.message));
    }

    return dispatch(
      deviceBindingActions.fetchDeviceBindingsAsync.failure('Ошибка получения данных связи устройства с пользователем'),
    );
  };
};

const addDeviceBinding = (deviceBinding: NewDeviceBinding): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceBindingActions.addDeviceBindingAsync.request(''));

    const response = await api.deviceBinding.addDeviceBinding(deviceBinding);

    if (response.type === 'ADD_DEVICEBINDING') {
      return dispatch(deviceBindingActions.addDeviceBindingAsync.success(response.deviceBinding));
    }

    if (response.type === 'ERROR') {
      return dispatch(deviceBindingActions.addDeviceBindingAsync.failure(response.message));
    }

    return dispatch(
      deviceBindingActions.addDeviceBindingAsync.failure('Ошибка добавления связи устройства с пользователем'),
    );
  };
};

const updateDeviceBinding = (deviceBinding: IDeviceBinding): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceBindingActions.updateDeviceBindingAsync.request('Обновление устройства'));

    const response = await api.deviceBinding.updateDeviceBinding(deviceBinding);

    if (response.type === 'UPDATE_DEVICEBINDING') {
      return dispatch(deviceBindingActions.updateDeviceBindingAsync.success(response.deviceBinding));
    }

    if (response.type === 'ERROR') {
      return dispatch(deviceBindingActions.updateDeviceBindingAsync.failure(response.message));
    }

    return dispatch(
      deviceBindingActions.updateDeviceBindingAsync.failure('Ошибка обновления связи устройства с пользователем'),
    );
  };
};

const removeDeviceBinding = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceBindingActions.removeDeviceBindingAsync.request('Удаление связи устройства с пользователем'));

    const response = await api.deviceBinding.removeDeviceBinding(id);

    if (response.type === 'REMOVE_DEVICEBINDING') {
      return dispatch(deviceBindingActions.removeDeviceBindingAsync.success());
    }

    if (response.type === 'ERROR') {
      return dispatch(deviceBindingActions.removeDeviceBindingAsync.failure(response.message));
    }

    return dispatch(
      deviceBindingActions.removeDeviceBindingAsync.failure('Ошибка удаления связи устройства с пользователем'),
    );
  };
};

export default {
  fetchDeviceBindings,
  fetchDeviceBindingById,
  addDeviceBinding,
  updateDeviceBinding,
  removeDeviceBinding,
};
