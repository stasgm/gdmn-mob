import { ActionType, createAction } from 'typesafe-actions';

import { IFormParam, IAppState } from './types';

const init = createAction('APP/INIT')();

const setFormParams = createAction('APP/SET_FORM_PARAMS')<IFormParam>();
const clearFormParams = createAction('APP/CLEAR_FORM_PARAMS')();
const setLoading = createAction('APP/SET_LOADING')<boolean>();
const setErrorList = createAction('APP/SET_ERROR_LIST')<string[]>();
const setSyncDate = createAction('APP/SET_SYNC_DATE')<Date>();
const loadData = createAction('APP/LOAD_DATA')<IAppState>();
const setLoadingData = createAction('APP/SET_LOADING_DATA')<boolean>();
const setLoadingError = createAction('APP/SET_LOADING_ERROR')<string>();

/**
 * Для ускорения работы программы мы кэшируем часть данных
 * в дисковых файлах. Эти данные надо подгрузить в определенный
 * момент в начале работы программы.
 * При этом, некоторые данные не зависят от залогиненого пользователя,
 * а некоторые зависят. Первые мы назовем глобальные данные,
 * вторые просто данные. Для их загрузки создадим два
 * специальных экшена, которые документированы и известны
 * всем разработчикам подсистем платформы. Если подсистема нуждается
 * в кэшировании данных, то разработчик пишет middleware
 * которое отлавливает вышеуказанные экшены и загружает нужные данные.
 *
 * Обратите внимание, что LOAD_SUPER_DATA вызывается в тот момент, когда
 * в стэйт редукса уже записан логин пользователя. Т.е. подсистема
 * может обратиться к getState() и взять оттуда login.
 *
 * Откуда подсистема знает где взять логин?
 * Логин пользователя -- это часть общих данных, о структуре которых
 * известно каждому разработчику подсистем платформы.
 */

const loadGlobalDataFromDisc = createAction('APP/LOAD_GLOBAL_DATA_FROM_DISC')();
const loadSuperDataFromDisc = createAction('APP/LOAD_SUPER_DATA_FROM_DISC')();

export const appActions = {
  init,
  setFormParams,
  clearFormParams,
  setLoading,
  setErrorList,
  setSyncDate,
  loadGlobalDataFromDisc,
  loadSuperDataFromDisc,
  loadData,
  setLoadingData,
  setLoadingError,
};

export type AppActionType = ActionType<typeof appActions>;
