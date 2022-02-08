/**
 * У каждой подсистемы есть свое мидлвэр, которое отлавливает
 * супер экшен загрузки данных и грузит их с диска.
 *
 */

import { getType } from 'typesafe-actions';

import { appActions } from '../app/actions';
import { PersistedMiddleware } from '../types';

import { actions } from './actions';

import { initialState } from './reducer';

export const authMiddlewareFactory: PersistedMiddleware =
  (load, save) => (store: any) => (next: any) => (action: any) => {
    /**
     *  Данные одной подсистемы кэшируются в одном или нескольких файлах.
     *  Мы не сохраняем ВЕСЬ стэйт в ОДНОМ файле, так как он может быть ОЧЕНЬ
     *  большим и при сохранении мы не можем сделать операцию JSON.stringify
     *  асинхронной.
     *
     *  Данные в файлы кэша записываются только когда меняются.
     */

    if (action.type === getType(appActions.loadGlobalDataFromDisc)) {
      // здесь мы грузим какие-то данные не зависимые от залогиненого пользователя
      store.dispatch(actions.setLoadingData(true));
      load('auth')
        .then((data) => {
          return store.dispatch(
            actions.loadData({
              ...initialState,
              ...data,
              connectionStatus: 'not-connected',
              isInit: data ? !data.config.deviceId || data.isDemo : true,
            }),
          );
        })
        .finally(() => {
          store.dispatch(actions.setLoadingData(false));
        })
        .catch((err) => {
          /* что, если ошибка */
          if (err instanceof Error) {
            store.dispatch(actions.setLoadingError(err.message));
          } else {
            store.dispatch(actions.setLoadingError(`Неизвестная ошибка: ${err}`));
          }
        });
    }

    switch (action.type) {
      case getType(actions.init):
      case getType(actions.setConfig):
      case getType(actions.setCompany):
      case getType(actions.setDemoModeAsync.success):
      case getType(actions.disconnectAsync.success):
      case getType(actions.logoutUserAsync.success):
      case getType(actions.getDeviceByUidAsync.success):
      case getType(actions.loginUserAsync.success):
      case getType(actions.setUserSettingsAsync.success): {
        const result = next(action);
        save('auth', store.getState().auth).catch((err) => {
          if (err instanceof Error) {
            store.dispatch(actions.setLoadingError(err.message));
          } else {
            store.dispatch(actions.setLoadingError(`Неизвестная ошибка: ${err}`));
          }
        });
        return result;
      }
    }

    return next(action);
  };
