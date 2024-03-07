import { ThunkAction } from 'redux-thunk';
import api from '@lib/client-api';

import { authActions } from '@lib/store';

import { IFileParams } from '@lib/types';

import { AppState } from '..';

import { webRequest } from '../webRequest';

import { IDeviceLogFileFilter } from '../../types';

import { deviceLogActions, DeviceLogActionType } from './actions';

export type AppThunk = ThunkAction<Promise<DeviceLogActionType>, AppState, null, DeviceLogActionType>;

const fetchDeviceLogFiles = (
  logFilters?: IDeviceLogFileFilter,
  filterText?: string,
  fromRecord?: number,
  toRecord?: number,
): AppThunk => {
  const params: Record<string, string | number> = logFilters ? logFilters : {};

  if (filterText) params.filterText = filterText;
  if (fromRecord) params.fromRecord = fromRecord;
  if (toRecord) params.toRecord = toRecord;
  return async (dispatch) => {
    dispatch(deviceLogActions.fetchDeviceLogFilesAsync.request(''));

    const response = await api.deviceLog.getDeviceLogFiles(webRequest(dispatch, authActions), params);

    if (response.type === 'GET_DEVICELOGS') {
      return dispatch(deviceLogActions.fetchDeviceLogFilesAsync.success(response.deviceLogs));
    }

    return dispatch(deviceLogActions.fetchDeviceLogFilesAsync.failure(response.message));
  };
};

const fetchDeviceLog = (
  id: string,
  ext?: string,
  folder?: string,
  appSystemId?: string,
  companyId?: string,
): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceLogActions.fetchDeviceLogAsync.request(''));

    const params: Record<string, string | number> = { id };

    if (ext) params.ext = ext;
    if (folder) params.folder = folder;
    if (appSystemId) params.appSystemId = appSystemId;
    if (companyId) params.companyId = companyId;

    const response = await api.deviceLog.getDeviceLog(webRequest(dispatch, authActions), params);

    if (response.type === 'GET_DEVICELOG') {
      return dispatch(deviceLogActions.fetchDeviceLogAsync.success(response.deviceLog));
    }

    return dispatch(deviceLogActions.fetchDeviceLogAsync.failure(response.message));
  };
};

const deleteDeviceLog = (
  id: string,
  ext?: string,
  folder?: string,
  appSystemId?: string,
  companyId?: string,
): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceLogActions.removeDeviceLogAsync.request(''));

    const params: Record<string, string | number> = { id };

    if (ext) params.ext = ext;
    if (folder) params.folder = folder;
    if (appSystemId) params.appSystemId = appSystemId;
    if (companyId) params.companyId = companyId;

    const response = await api.deviceLog.deleteDeviceLog(webRequest(dispatch, authActions), params);

    if (response.type === 'REMOVE_DEVICELOG') {
      return dispatch(deviceLogActions.removeDeviceLogAsync.success(id));
    }

    return dispatch(deviceLogActions.removeDeviceLogAsync.failure(response.message));
  };
};

const deleteDeviceLogs = (deviceLogIds: IFileParams[]): AppThunk => {
  return async (dispatch) => {
    dispatch(deviceLogActions.removeDeviceLogsAsync.request(''));

    const response = await api.deviceLog.deleteDeviceLogs(webRequest(dispatch, authActions), deviceLogIds);

    if (response.type === 'REMOVE_DEVICELOGS') {
      return dispatch(deviceLogActions.removeDeviceLogsAsync.success(deviceLogIds));
    }

    return dispatch(deviceLogActions.removeDeviceLogsAsync.failure(response.message));
  };
};

export default { fetchDeviceLogFiles, fetchDeviceLog, deleteDeviceLog, deleteDeviceLogs };
