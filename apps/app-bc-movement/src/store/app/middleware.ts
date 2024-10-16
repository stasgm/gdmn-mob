/**
 * У каждой подсистемы есть свое мидлвэр, которое отлавливает
 * супер экшен загрузки данных и грузит их с диска.
 *
 */

import { appActions, PersistedMiddleware } from '@lib/store';
import { getType } from 'typesafe-actions';

import { actions } from './actions';

import { initialState } from './reducer';

export const appMovMiddlewareFactory: PersistedMiddleware =
  (load, _) => (store: any) => (next: any) => (action: any) => {
    /**
     *  Данные одной подсистемы кэшируются в одном или нескольких файлах.
     *  Мы не сохраняем ВЕСЬ стэйт в ОДНОМ файле, так как он может быть ОЧЕНЬ
     *  большим и при сохранении мы не можем сделать операцию JSON.stringify
     *  асинхронной.
     *
     *  Данные в файлы кэша записываются только когда меняются.
     */

    if (action.type === getType(appActions.loadSuperDataFromDisc) && store.getState().auth.user?.id) {
      // а здесь мы грузим данные для залогиненого пользователя
      store.dispatch(actions.setLoadingData(true));
      load('appMovement', store.getState().auth.user?.id)
        .then((data: any) => store.dispatch(actions.loadData(data || initialState)))
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

    if (action.type === getType(appActions.clearSuperDataFromDisc)) {
      store.dispatch(appActions.init());
    }

    return next(action);
  };
