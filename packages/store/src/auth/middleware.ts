/**
 * У каждой подсистемы есть свое мидлвэр, которое отлавливает
 * супер экшен загрузки данных и грузит их с диска.
 *
 */

import { getType } from 'typesafe-actions';

import { loadDataFromDisk, saveDataToDisk } from '../utils/appStorage';

import { appActions } from '../app/actions';

import { actions } from './actions';

import { initialState } from './reducer';

export const authMiddleware = (store: any) => (next: any) => (action: any) => {
  /**
   *  Данные одной подсистемы кэшируются в одном или нескольких файлах.
   *  Мы не сохраняем ВЕСЬ стэйт в ОДНОМ файле, так как он может быть ОЧЕНЬ
   *  большим и при сохранении мы не можем сделать операцию JSON.stringify
   *  асинхронной.
   *
   *  Данные в файлы кэша записываются только когда меняются.
   */
  // const userId = store.getState().auth.user?.id;
  if (action.type === getType(appActions.loadGlobalDataFromDisc)) {
    // здесь мы грузим какие-то данные не зависимые от залогиненого пользователя
    const loading = store.getState().app.loading;
    if (!loading) {
      store.dispatch(appActions.setLoading(true));
    }
    loadDataFromDisk('auth')
      .then((data) => {
        // console.log('loadDataFromDisk auth', data || initialState);
        return store.dispatch(actions.loadData({ ...initialState, ...data, connectionStatus: 'not-connected' }));
      })
      .finally(() => {
        if (!loading) {
          store.dispatch(appActions.setLoading(false));
        }
      })
      .catch((err) => {
        /* что, если ошибка */
        console.error(
          err instanceof Error || typeof err !== 'object' ? err : 'При загрузки данных с диска произошла ошибка',
        );
      });
  }

  switch (action.type) {
    case getType(actions.init):
    case getType(actions.setConfig):
    case getType(actions.setCompany):
    case getType(actions.disconnectAsync.success):
    case getType(actions.logoutUserAsync.success):
    case getType(actions.getDeviceByUidAsync.success):
    case getType(actions.loginUserAsync.success):
    case getType(actions.setUserSettingsAsync.success):
    case getType(actions.setDemoModeAsync.success): {
      const result = next(action);

      const newData = store.getState().auth;
      saveDataToDisk('auth', { ...newData, connectionStatus: 'not-connected' });
      return result;
    }
  }

  return next(action);
};
