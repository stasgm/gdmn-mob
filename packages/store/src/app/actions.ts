import { IDeviceLog } from '@lib/types';
import { ActionType, createAction } from 'typesafe-actions';

import { IFormParam, IAppState, IRequestNotice, IErrorNotice, ISyncRequest, ISyncRequestParam } from './types';

const init = createAction('APP/INIT')();

const setFormParams = createAction('APP/SET_FORM_PARAMS')<IFormParam>();
const clearFormParams = createAction('APP/CLEAR_FORM_PARAMS')();
const setScreenFormParams = createAction('APP/SET_SCREEN_FORM_PARAMS')<{ screenName: string; params: IFormParam }>();
const clearScreenFormParams = createAction('APP/CLEAR_SCREEN_FORM_PARAMS')<string>();
const setLoading = createAction('APP/SET_LOADING')<boolean>();
const setAutoSync = createAction('APP/SET_AUTO_SYNC')<boolean>();
const setLoadedWithError = createAction('APP/SET_LOADED_WITH_ERROR')<boolean>();
const addErrors = createAction('APP/ADD_ERROR_MANY')<IDeviceLog[]>();
const setSentErrors = createAction('APP/SET_SENT_ERROR')<string[]>();
const clearErrors = createAction('APP/CLEAR_ERROR')<'all' | 'old'>();
const setSyncDate = createAction('APP/SET_SYNC_DATE')<Date>();
const loadData = createAction('APP/LOAD_DATA')<IAppState>();
const setLoadingData = createAction('APP/SET_LOADING_DATA')<boolean>();
const setLoadingError = createAction('APP/SET_LOADING_ERROR')<string>();
const setShowSyncInfo = createAction('APP/SET_SHOW_SYNCH_INFO')<boolean>();

const addRequestNotice = createAction('APP/ADD_REQUEST_NOTICE')<IRequestNotice>();
const clearRequestNotice = createAction('APP/CLEAR_REQUEST_NOTICE')();
const addErrorNotice = createAction('APP/ADD_ERROR_NOTICE')<IErrorNotice>();
const clearErrorNotice = createAction('APP/CLEAR_ERROR_NOTICE')();

const addSyncRequest = createAction('APP/ADD_SYNC_REQUEST')<ISyncRequest>();
const removeSyncRequest = createAction('APP/DEL_SYNC_REQUEST')<{
  cmdName: string;
  param?: ISyncRequestParam;
}>();

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
const clearSuperDataFromDisc = createAction('APP/CLEAR_SUPER_DATA_FROM_DISC')();

export const appActions = {
  init,
  setFormParams,
  clearFormParams,
  setLoading,
  setLoadedWithError,
  setAutoSync,
  addErrors,
  setSentErrors,
  clearErrors,
  setSyncDate,
  loadGlobalDataFromDisc,
  loadSuperDataFromDisc,
  clearSuperDataFromDisc,
  loadData,
  setLoadingData,
  setLoadingError,
  addRequestNotice,
  clearRequestNotice,
  addErrorNotice,
  clearErrorNotice,
  setShowSyncInfo,
  addSyncRequest,
  removeSyncRequest,
  setScreenFormParams,
  clearScreenFormParams,
};

export type AppActionType = ActionType<typeof appActions>;
