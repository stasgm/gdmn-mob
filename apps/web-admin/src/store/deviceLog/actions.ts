import { IDeviceLog, IDeviceLogFiles } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { IPageParam } from '../../types';

const init = createAction('DEVICE_LOG/INIT')();
const clearError = createAction('DEVICE_LOG/CLEAR_ERROR')();
const setError = createAction('DEVICE_LOG/SET_ERROR')();

const fetchDeviceLogsAsync = createAsyncAction(
  'DEVICE_LOG/FETCH_DEVICE_LOGS',
  'DEVICE_LOG/FETCH_DEVICE_LOGS_SUCCESS',
  'DEVICE_LOG/FETCH_DEVICE_LOGS_FAILURE',
)<string | undefined, IDeviceLogFiles[], string>();

const fetchDeviceLogAsync = createAsyncAction(
  'DEVICE_LOG/FETCH_DEVICE_LOG',
  'DEVICE_LOG/FETCH_DEVICE_LOG_SUCCESS',
  'DEVICE_LOG/FETCH_DEVICE_LOG_FAILURE',
)<string | undefined, IDeviceLog[], string>();

const removeDeviceLogsAsync = createAsyncAction(
  'DEVICE_LOG/REMOVE_DEVICE_LOG',
  'DEVICE_LOG/REMOVE_DEVICE_LOG_SUCCESS',
  'DEVICE_LOG/REMOVE_DEVICE_LOG_FAILURE',
)<string | undefined, string, string>();

const setPageParam = createAction('DEVICE_LOG/SET_PARAM')<IPageParam | undefined>();
const clearPageParams = createAction('DEVICE_LOG/CLEAR_PARAMS')();

export const deviceLogActions = {
  fetchDeviceLogsAsync,
  fetchDeviceLogAsync,
  removeDeviceLogsAsync,
  clearPageParams,
  setPageParam,
  clearError,
  init,
  setError,
};

export type DeviceLogActionType = ActionType<typeof deviceLogActions>;
