import { getType } from 'typesafe-actions';

import { loadDataFromDisk, saveDataToDisk } from '../utils/appStorage';

import { appActions } from '../app/actions';

import { initialState } from './reducer';

import { actions } from './actions';

export const settingMiddleware = (store: any) => (next: any) => (action: any) => {
  /**
   *  Данные одной подсистемы кэшируются в одном или нескольких файлах.
   *  Мы не сохраняем ВЕСЬ стэйт в ОДНОМ файле, так как он может быть ОЧЕНЬ
   *  большим и при сохранении мы не можем сделать операцию JSON.stringify
   *  асинхронной.
   *
   *  Данные в файлы кэша записываются только когда меняются.
   */

  //doc.global.json
  //doc.user.<user_ID>.json
  const state = store.getState();
  const userId = state.auth.user?.id;
  const loading = state.app.loading;

  if (action.type === getType(appActions.loadGlobalDataFromDisc)) {
    // здесь мы грузим какие-то данные не зависимые от залогиненого пользователя
    if (!loading) {
      store.dispatch(appActions.setLoading(true));
    }
    loadDataFromDisk('settings')
      .then((data) => store.dispatch(actions.loadData(data || initialState)))
      .finally(() => {
        if (!loading) {
          store.dispatch(appActions.setLoading(false));
        }
      })
      .catch((err) => {
        /* что, если ошибка */
        console.error(
          err instanceof Error || typeof err !== 'object' ? err : 'При загрузке настроек с диска произошла ошибка',
        );
      });
  }

  if (action.type === getType(appActions.loadSuperDataFromDisc) && userId) {
    // а здесь мы грузим данные для залогиненого пользователя
    if (!loading) {
      store.dispatch(appActions.setLoading(true));
    }
    loadDataFromDisk('settings', userId)
      .then((data) => {
        // console.log('settings userssssss', data || initialState);
        return store.dispatch(actions.loadData(data || initialState));
      })
      .finally(() => {
        if (!loading) {
          store.dispatch(appActions.setLoading(false));
        }
      })
      .catch((err) => {
        /* что, если ошибка */
        console.error(
          err instanceof Error || typeof err !== 'object' ? err : 'При загрузке справочников с диска произошла ошибка',
        );
      });
  }

  if (userId) {
    switch (action.type) {
      case getType(actions.init):
      case getType(actions.addOption):
      case getType(actions.updateOption):
      case getType(actions.addSettings):
      case getType(actions.deleteOption):
      case getType(actions.deleteAllSettings):
      case getType(actions.addSettingsAsync.success): {
        const result = next(action);

        saveDataToDisk('settings', store.getState().settings, userId);
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
