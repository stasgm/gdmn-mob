/**
 * У каждой подсистемы есть свое мидлвэр, которое отлавливает
 * супер экшен загрузки данных и грузит их с диска.
 *
 */

import { appActions, loadDataFromDisk, saveDataToDisk } from '@lib/store';
import { getType } from 'typesafe-actions';

import { actions } from './actions';

import { initialState } from './reducer';

export const appTradeMiddleware = (store: any) => (next: any) => (action: any) => {
  /**
   *  Данные одной подсистемы кэшируются в одном или нескольких файлах.
   *  Мы не сохраняем ВЕСЬ стэйт в ОДНОМ файле, так как он может быть ОЧЕНЬ
   *  большим и при сохранении мы не можем сделать операцию JSON.stringify
   *  асинхронной.
   *
   *  Данные в файлы кэша записываются только когда меняются.
   */
  const state = store.getState();
  const userId = state.auth.user?.id;
  const loading = state.app.loading;

  if (action.type === getType(appActions.loadGlobalDataFromDisc)) {
    // здесь мы грузим какие-то данные не зависимые от залогиненого пользователя
    store.dispatch(appActions.setLoading(true));
    loadDataFromDisk('appTrade')
      .then((data: any) => store.dispatch(actions.loadData(data || initialState)))
      .finally(() => {
        if (!loading) {
          store.dispatch(appActions.setLoading(false));
        }
      })
      .catch((err) => {
        /* что, если ошибка */
        console.error(
          err instanceof Error || typeof err !== 'object' ? err : 'При загрузке данных с диска произошла ошибка',
        );
      });
  }

  if (action.type === getType(appActions.loadSuperDataFromDisc) && userId) {
    // а здесь мы грузим данные для залогиненого пользователя
    store.dispatch(appActions.setLoading(true));
    loadDataFromDisk('appTrade', userId)
      .then((data: any) => store.dispatch(actions.loadData(data || initialState)))
      .finally(() => {
        if (!loading) {
          store.dispatch(appActions.setLoading(false));
        }
      })
      .catch((err) => {
        /* что, если ошибка */
        console.error(
          err instanceof Error || typeof err !== 'object' ? err : 'При загрузке данных с диска произошла ошибка',
        );
      });
  }

  if (userId) {
    switch (action.type) {
      case getType(actions.setGoodModelAsync.success): {
        const result = next(action);

        // saveDataToDisk('appTrade', store.getState().appTrade, userId);
        return result;
      }
    }
  }

  return next(action);
};
