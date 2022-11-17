import { ThunkAction } from 'redux-thunk';
import api from '@lib/client-api';

import { AppState } from '..';

import { deviceLogActions, DeviceLogActionType } from './actions';

export type AppThunk = ThunkAction<Promise<DeviceLogActionType>, AppState, null, DeviceLogActionType>;

const fetchDeviceLogs = (): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceLogActions.fetchDeviceLogsAsync.request(''));

    const params: Record<string, string | number> = {};

    // if (filterText) params.filterText = filterText;
    // if (fromRecord) params.fromRecord = fromRecord;
    // if (toRecord) params.toRecord = toRecord;

    const response = await api.deviceLog.getDeviceLogs(params);

    if (response.type === 'GET_DEVICELOGS') {
      return dispatch(deviceLogActions.fetchDeviceLogsAsync.success(response.deviceLogs));
    }

    if (response.type === 'ERROR') {
      return dispatch(deviceLogActions.fetchDeviceLogsAsync.failure(response.message));
    }

    return dispatch(deviceLogActions.fetchDeviceLogsAsync.failure('Ошибка получения данных о журнале ошибок'));
  };
};

const fetchDeviceLog = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceLogActions.fetchDeviceLogAsync.request(''));

    const response = await api.deviceLog.getDeviceLog(id);

    if (response.type === 'GET_DEVICELOG') {
      return dispatch(deviceLogActions.fetchDeviceLogAsync.success(response.deviceLog));
    }

    if (response.type === 'ERROR') {
      return dispatch(deviceLogActions.fetchDeviceLogAsync.failure(response.message));
    }

    return dispatch(deviceLogActions.fetchDeviceLogAsync.failure('Ошибка получения данных о журнале ошибок'));
  };
};

const removeDeviceLog = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceLogActions.fetchDeviceLogAsync.request(''));

    const response = await api.deviceLog.removeDeviceLog(id);

    if (response.type === 'REMOVE_DEVICELOG') {
      return dispatch(deviceLogActions.removeDeviceLogsAsync.success(id));
    }

    if (response.type === 'ERROR') {
      return dispatch(deviceLogActions.removeDeviceLogsAsync.failure(response.message));
    }

    return dispatch(deviceLogActions.removeDeviceLogsAsync.failure('Ошибка получения данных о журнале ошибок'));
  };
};

export default { fetchDeviceLogs, fetchDeviceLog, removeDeviceLog };
