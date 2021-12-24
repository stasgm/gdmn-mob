/**
 * У каждой подсистемы есть свое мидлвэр, которое отлавливает
 * супер экшен загрузки данных и грузит их с диска.
 *
 */

import { appActions, PersistedMiddleware } from '@lib/store';
import { getType } from 'typesafe-actions';

import { actions } from './actions';

import { initialState } from './reducer';

export const appTradeMiddlewareFactory: PersistedMiddleware =
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
      store.dispatch(actions.setLoading(true));
      load('appTrade')
        .then((data: any) => store.dispatch(actions.loadData(data || initialState)))
        .finally(() => {
          store.dispatch(actions.setLoading(false));
        })
        .catch((err) => {
          /* что, если ошибка */
          console.error(
            err instanceof Error || typeof err !== 'object' ? err : 'При загрузке данных с диска произошла ошибка',
          );
        });
    }

    if (action.type === getType(appActions.loadSuperDataFromDisc) && store.getState().auth.user?.id) {
      // а здесь мы грузим данные для залогиненого пользователя
      store.dispatch(actions.setLoading(true));
      load('appTrade', store.getState().auth.user?.id)
        .then((data: any) => store.dispatch(actions.loadData(data || initialState)))
        .finally(() => {
          store.dispatch(actions.setLoading(false));
        })
        .catch((err) => {
          /* что, если ошибка */
          console.error(
            err instanceof Error || typeof err !== 'object' ? err : 'При загрузке данных с диска произошла ошибка',
          );
        });
    }

    if (store.getState().auth.user?.id) {
      switch (action.type) {
        case getType(actions.setGoodModelAsync.success): {
          const result = next(action);

          save('appTrade', store.getState().appTrade, store.getState().auth.user?.id);
          return result;
        }
      }
    }

    return next(action);
  };
