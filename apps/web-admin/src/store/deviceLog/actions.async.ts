import { ThunkAction } from 'redux-thunk';
import api from '@lib/client-api';

import { IAppSystem, NewAppSystem } from '@lib/types';

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

    return dispatch(deviceLogActions.fetchDeviceLogsAsync.failure('Ошибка получения данных о подсистемах'));
  };
};

export default { fetchDeviceLogs };
