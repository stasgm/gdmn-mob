import api from '@lib/client-api';

import { ThunkAction } from 'redux-thunk';

import { AppState } from '..';

import { processActions, ProcessActionType } from './actions';

export type AppThunk = ThunkAction<Promise<ProcessActionType>, AppState, null, ProcessActionType>;

/*const fetchActivationCodeById = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(activationCodeActions.fetchActivationCodeAsync.request(''));

    const response = await api.activationCode.getDevice(id);

    if (response.type === 'GET_DEVICE') {
      return dispatch(activationCodeActions.fetchActivationCodeAsync.success(response.activationCode));
    }

    if (response.type === 'ERROR') {
      return dispatch(activationCodeActions.fetchActivationCodeAsync.failure(response.message));
    }

    return dispatch(activationCodeActions.fetchActivationCodesAsync.failure('Ошибка получения данных об устройстве'));
  };
};*/

// const fetchActivationCodes = (deviceId?: string): AppThunk => {
//   return async (dispatch) => {
//     dispatch(activationCodeActions.fetchCodesAsync.request(''));

//     const response = await api.activationCode.getActivationCodes(deviceId ? { deviceId: deviceId } : undefined);

//     if (response.type === 'GET_CODES') {
//       return dispatch(activationCodeActions.fetchCodesAsync.success(response.codes));
//     }

//     if (response.type === 'ERROR') {
//       return dispatch(activationCodeActions.fetchCodesAsync.failure(response.message));
//     }

//     return dispatch(activationCodeActions.fetchCodesAsync.failure('Ошибка получения данных об активационных кодах'));
//   };
// };

const fetchProcesses = (): AppThunk => {
  return async (dispatch) => {
    dispatch(processActions.fetchProcessesAsync.request(''));

    // const params: Record<string, string | number> = {};

    // const response = await api.appSystem.getAppSystems(params);
    const response = await api.process.getProcesses();
    // const response = await api.appSystem.getAppSystems();

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
