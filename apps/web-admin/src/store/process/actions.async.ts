import api from '@lib/client-api';

import { ThunkAction } from 'redux-thunk';

import { AppState } from '..';

import { processActions, ProcessActionType } from './actions';

export type AppThunk = ThunkAction<Promise<ProcessActionType>, AppState, null, ProcessActionType>;

const fetchProcesses = (filterText?: string, fromRecord?: number, toRecord?: number): AppThunk => {
  return async (dispatch) => {
    dispatch(processActions.fetchProcessesAsync.request(''));

    const params: Record<string, string | number> = {};

    if (filterText) params.filterText = filterText;
    if (fromRecord) params.fromRecord = fromRecord;
    if (toRecord) params.toRecord = toRecord;

    const response = await api.process.getProcesses(params);

    if (response.type === 'GET_PROCESSES') {
      return dispatch(processActions.fetchProcessesAsync.success(response.processes));
    }

    if (response.type === 'ERROR') {
      return dispatch(processActions.fetchProcessesAsync.failure(response.message));
    }

    return dispatch(processActions.fetchProcessesAsync.failure('Ошибка получения данных о процессах'));
  };
};

const removeProcess = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(processActions.removeProcessAsync.request('Удаление процесса'));

    const response = await api.process.removeProcess(id);

    if (response.type === 'REMOVE_PROCESS') {
      return dispatch(processActions.removeProcessAsync.success(id));
    }

    if (response.type === 'ERROR') {
      return dispatch(processActions.removeProcessAsync.failure(response.message));
    }

    return dispatch(processActions.removeProcessAsync.failure('Ошибка удаления процесса'));
  };
};

export default { fetchProcesses, removeProcess };
