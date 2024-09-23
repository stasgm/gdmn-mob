import api from '@lib/client-api';
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

    const [responseDevices, responseLogFiles, responseBindings, responseUsers, responseAppSystems] = await Promise.all([
      api.device.getDevices(webRequest(dispatch, authActions), params),
      api.deviceLog.getDeviceLogFiles(webRequest(dispatch, authActions)),
      api.deviceBinding.getDeviceBindings(webRequest(dispatch, authActions)),
      api.user.getUsers(webRequest(dispatch, authActions)),
      api.appSystem.getAppSystems(webRequest(dispatch, authActions)),
    ]);

    if (responseDevices.type === 'GET_DEVICES') {
      const devices = responseDevices.devices;

      if (responseLogFiles.type === 'GET_DEVICELOGS') {
        const fileList = responseLogFiles.deviceLogFiles;
        // Получаем логи для каждого файла
        const promises = fileList.map(async (file) => {
          const params: Record<string, string | number> = {
            appSystemId: file.appSystem.id,
            companyId: file.company.id,
          };

          const responseLog = await api.deviceLog.getDeviceLog(webRequest(dispatch, authActions), file.id, params);
          if (responseLog.type === 'GET_DEVICELOG' && responseLog.deviceLogData.appVersion) {
            //В devices добавляем версию приложения, если она до сих пор не указана
            const device = devices.find((d) => d.id === file.device.id && d.appVersion === undefined);
            if (device) {
              device.appVersion = responseLog.deviceLogData.appVersion;
            }
          }
        });

        await Promise.all(promises);
      }

      if (
        responseBindings.type === 'GET_DEVICEBINDINGS' &&
        responseUsers.type === 'GET_USERS' &&
        responseAppSystems.type === 'GET_APP_SYSTEMS'
      ) {
        // Проходим по каждому устройству и находим erp пользователя, чтобы получить подсистему
        devices.forEach((device) => {
          const binding = responseBindings.deviceBindings.find((b) => b.device.id === device.id);
          if (binding) {
            const erpUserId = responseUsers.users.find((u) => u.id === binding.user.id)?.erpUser?.id;
            const appSystemId = responseUsers.users.find((u) => u.id === erpUserId)?.appSystem?.id;
            if (appSystemId) {
              device.appSystem = responseAppSystems.appSystems.find((a) => a.id === appSystemId);
            }
          }
        });
      }

      return dispatch(deviceActions.fetchDevicesAsync.success(devices));
    }

    return dispatch(deviceActions.fetchDevicesAsync.failure(responseDevices.message));
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
