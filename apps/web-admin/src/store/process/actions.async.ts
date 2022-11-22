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

    return dispatch(processActions.fetchProcessesAsync.failure(response.message));
  };
};

const removeProcess = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(processActions.removeProcessAsync.request('Удаление процесса'));

    const response = await api.process.removeProcess(id);

    if (response.type === 'REMOVE_PROCESS') {
      return dispatch(processActions.removeProcessAsync.success(id));
    }

    return dispatch(processActions.removeProcessAsync.failure(response.message));
  };
};

export default { fetchProcesses, removeProcess };
