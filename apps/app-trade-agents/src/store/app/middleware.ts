/**
 * У каждой подсистемы есть свое мидлвэр, которое отлавливает
 * супер экшен загрузки данных и грузит их с диска.
 *
 */

import { appActions, loadDataFromDisk, saveDataToDisk } from '@lib/store';

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
  const userId = store.getState().auth.user?.id;

  if (action.type === 'APP/LOAD_GLOBAL_DATA_FROM_DISC') {
    // здесь мы грузим какие-то данные не зависимые от залогиненого пользователя
    loadDataFromDisk('appTrade')
      .then((data: any) => store.dispatch(actions.loadData(data ? data : initialState)))
      .catch(() => {
        /* что, если ошибка */
      });
  }

  if (action.type === 'APP/LOAD_SUPER_DATA_FROM_DISC' && userId) {
    // а здесь мы грузим данные для залогиненого пользователя
    store.dispatch(appActions.setLoading(true));
    loadDataFromDisk('appTrade', userId)
      .then((data: any) => store.dispatch(actions.loadData(data ? data : initialState)))
      .finally(() => {
        store.dispatch(appActions.setLoading(false));
      })
      .catch((err) => {
        /* что, если ошибка */
        console.error(
          err instanceof Error || typeof err !== 'object' ? err : 'При загрузке данных с диска произошла ошибка',
        );
      });
  }

  if (action.type === 'APP_TRADE/SET_GOOD_MODEL_SUCCESS' && userId) {
    next(action);

    saveDataToDisk('appTrade', store.getState().appTrade, userId);
  }

  return next(action);
};
