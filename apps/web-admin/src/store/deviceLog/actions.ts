import { IDeviceData, IDeviceLogFiles } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { IDeviceLogPageParam } from '../../types';

const init = createAction('DEVICE_LOG/INIT')();
const clearError = createAction('DEVICE_LOG/CLEAR_ERROR')();
const setError = createAction('DEVICE_LOG/SET_ERROR')();

const fetchDeviceLogFilesAsync = createAsyncAction(
  'DEVICE_LOG/FETCH_DEVICE_LOG_FILES',
  'DEVICE_LOG/FETCH_DEVICE_LOG_FILES_SUCCESS',
  'DEVICE_LOG/FETCH_DEVICE_LOG_FILES_FAILURE',
)<string | undefined, IDeviceLogFiles[], string>();

const fetchDeviceLogAsync = createAsyncAction(
  'DEVICE_LOG/FETCH_DEVICE_LOG',
  'DEVICE_LOG/FETCH_DEVICE_LOG_SUCCESS',
  'DEVICE_LOG/FETCH_DEVICE_LOG_FAILURE',
)<string | undefined, IDeviceData, string>();

const removeDeviceLogAsync = createAsyncAction(
  'DEVICE_LOG/REMOVE_DEVICE_LOG',
  'DEVICE_LOG/REMOVE_DEVICE_LOG_SUCCESS',
  'DEVICE_LOG/REMOVE_DEVICE_LOG_FAILURE',
)<string | undefined, string, string>();

const removeDeviceLogsAsync = createAsyncAction(
  'DEVICE_LOG/REMOVE_MANY',
  'DEVICE_LOG/REMOVE_MANY_SUCCESS',
  'DEVICE_LOG/REMOVE_MANY_FAILURE',
)<string | undefined, string[], string>();

const setPageParam = createAction('DEVICE_LOG/SET_PARAM')<IDeviceLogPageParam | undefined>();
const clearPageParams = createAction('DEVICE_LOG/CLEAR_PARAMS')();

export const deviceLogActions = {
  fetchDeviceLogFilesAsync,
  fetchDeviceLogAsync,
  removeDeviceLogAsync,
  removeDeviceLogsAsync,
  clearPageParams,
  setPageParam,
  clearError,
  init,
  setError,
};

export type DeviceLogActionType = ActionType<typeof deviceLogActions>;
