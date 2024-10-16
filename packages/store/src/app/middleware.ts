import { getType } from 'typesafe-actions';

import { PersistedMiddleware } from '../types';

import { initialState } from './reducer';

import { appActions } from './actions';

export const appMiddlewareFactory: PersistedMiddleware =
  (load, save) => (store: any) => (next: any) => (action: any) => {
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
      store.dispatch(appActions.setLoadingData(true));
      load('app', store.getState().auth.user?.id)
        .then((data) => {
          return store.dispatch(
            appActions.loadData({ ...(data || initialState), showSyncInfo: false, errorMessage: '' }),
          );
        })
        .finally(() => {
          store.dispatch(appActions.setLoadingData(false));
        })
        .catch((err) => {
          /* что, если ошибка */
          if (err instanceof Error) {
            store.dispatch(appActions.setLoadingError(err.message));
          } else {
            store.dispatch(appActions.setLoadingError(`Неизвестная ошибка: ${err}`));
          }
        });
    }

    if (action.type === getType(appActions.clearSuperDataFromDisc)) {
      store.dispatch(appActions.init());
    }

    if (store.getState().auth.user?.id) {
      switch (action.type) {
        case getType(appActions.init):
        case getType(appActions.addErrors):
        case getType(appActions.setSentErrors):
        case getType(appActions.clearErrors):
        case getType(appActions.addSyncRequest):
        case getType(appActions.removeSyncRequest):
        case getType(appActions.setSyncDate): {
          const result = next(action);

          save('app', store.getState().app, store.getState().auth.user?.id).catch((err) => {
            if (err instanceof Error) {
              store.dispatch(appActions.setLoadingError(err.message));
            } else {
              store.dispatch(appActions.setLoadingError(`Неизвестная ошибка: ${err}`));
            }
          });
          return result;
        }
      }
    }

    return next(action);
  };

/*
А как избавиться от того, чтобы не сохранять руками для каждой подсистемы?

Для этого должен быть механизм в платформе, который мог бы грузить и сохранять изменения
для каждой подсистемы. Чтобы такой механихм работал в общем случае мы должны:

1) для каждой подсистемы выделить ее данные подлежащие сохранению на диск в кэш.
2) в каждой подсистеме должен поддерживаться специальный экшен ПОМЕЩЕНИЯ даных из кэша
   в стэйт этой подсистемы. Так как он будет называться одинаково, то в пэйлоде
   должно быть поле с ИД подсистемы.
3) все операции по изменению данных должны быть унифицированы, экшены должны называться
   одинаково (например INSERT_RECORD, UPDATE_RECORD, DELETE_RECORD) а имя подсистемы
   передается в пэйлоад и там же передаются данные для выполнения операции.
4) механизм, про который мы писали выше, включает мидлевар, который смотрит:
   а) это операция изменения данных?
   б) если да, то в какой подсистеме?
   в) берем имя файла для кэширования, данные этой подсистемы и записываем.
5) в начале приложения все, участвующие в нем подсистемы регистрируются. при этом
   мы должны указать ключ данных подсистемы или функцию для выделения данных
   подсистемы из общего стэйта. функцию формирования имени файла кэша. ид подсистемы.
 */
