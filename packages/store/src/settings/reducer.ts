import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { Settings, IBaseSettings } from '@lib/types';

import { actions, SettingsActionType } from './actions';

import { SettingsState } from './types';

export const mainSettingGroup = { id: 'main', name: 'Общие настройки', sortOrder: 1 };
export const synchSettingGroup = { id: 'synch', name: 'Синхронизация', sortOrder: 2 };
export const baseSettingGroup = { id: 'base', name: 'Настройки приложения', sortOrder: 3 };
export const serverSettingGroup = { id: 'server', name: 'Сервер', sortOrder: 0 };
export const cleanDocSettingGroup = { id: 'main', name: 'Хранение документов', sortOrder: 4 };

const baseSettings: Settings<IBaseSettings> = {
  serverAddress: {
    id: 'serverAddress',
    description: 'Адрес',
    data: 'https://',
    type: 'string',
    sortOrder: 1,
    visible: true,
    group: serverSettingGroup,
    readonly: true,
  },
  autoSync: {
    id: 'autoSync',
    sortOrder: 1,
    visible: true,
    description: 'Автоматическая синхронизация',
    data: false,
    type: 'boolean',
    group: synchSettingGroup,
  },
  synchPeriod: {
    id: 'synchPeriod',
    description: 'Синхронизация на сервере, мин.',
    data: 10,
    type: 'number',
    sortOrder: 3,
    visible: true,
    group: synchSettingGroup,
    readonly: true,
  },
  autoSynchPeriod: {
    id: 'autoSynchPeriod',
    description: 'Автосинхронизация, мин.',
    data: 10,
    type: 'number',
    sortOrder: 2,
    visible: true,
    group: synchSettingGroup,
    readonly: true,
  },
  getReferences: {
    id: 'getReferences',
    description: 'Запрашивать справочники',
    data: false,
    type: 'boolean',
    sortOrder: 1,
    visible: true,
    group: mainSettingGroup,
  },
  refLoadType: {
    id: 'refLoadType',
    description: 'Перезаписывать справочники',
    data: true,
    type: 'boolean',
    sortOrder: 2,
    visible: false,
    group: mainSettingGroup,
  },
  cleanDocTime: {
    id: 'cleanDocTime',
    description: 'Хранение документов, дн.',
    data: 60,
    type: 'number',
    sortOrder: 3,
    visible: true,
    group: cleanDocSettingGroup,
  },
  cleanDraftDocTime: {
    id: 'cleanDraftDocTime',
    description: 'Хранение черновиков, дн.',
    data: 60,
    type: 'number',
    sortOrder: 4,
    visible: true,
    group: cleanDocSettingGroup,
  },
  cleanReadyDocTime: {
    id: 'cleanReadyDocTime',
    description: 'Хранение гот. документов, дн.',
    data: 60,
    type: 'number',
    sortOrder: 5,
    visible: true,
    group: cleanDocSettingGroup,
  },
  cleanSentDocTime: {
    id: 'cleanSentDocTime',
    description: 'Хранение отпр. документов, дн.',
    data: 60,
    type: 'number',
    sortOrder: 6,
    visible: true,
    group: cleanDocSettingGroup,
  },
};

export const initialState: Readonly<SettingsState> = {
  data: baseSettings,
  userData: {},
  loading: false,
  loadingData: false,
  loadingError: '',
  errorMessage: '',
  isInit: true,
};

const reducer: Reducer<SettingsState, SettingsActionType> = (state = initialState, action): SettingsState => {
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.initData):
      return { ...state, data: baseSettings, isInit: true };

    case getType(actions.setLoading):
      return { ...state, loading: action.payload };

    case getType(actions.loadData):
      return { ...action.payload, loading: false, errorMessage: '' };

    case getType(actions.setLoadingData):
      return { ...state, loadingData: action.payload };

    case getType(actions.setLoadingError):
      return {
        ...state,
        loadingError: action.payload,
      };

    case getType(actions.updateOption):
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.optionName]: action.payload.value,
        },
      };

    case getType(actions.addSettings): {
      const baseSetts = Object.entries(baseSettings).reduce((setts: Settings, [field, baseSet]) => {
        const storeSet = state.data[field];
        setts[field] = storeSet ? storeSet : baseSet;
        return setts;
      }, {});

      const newSetts = Object.entries(action.payload).reduce((setts: Settings, [field, newSet]) => {
        const oldRef = state.data[field];
        setts[field] = oldRef ? { ...newSet, data: oldRef.data } : newSet;
        return setts;
      }, {});

      return {
        ...state,
        isInit: false,
        data: { ...baseSetts, ...newSetts },
      };
    }

    case getType(actions.deleteAllSettings):
      return { ...state, data: {} };

    case getType(actions.deleteOption): {
      const removeProps = action.payload;
      const { [removeProps]: remove, ...rest } = state.data;
      return { ...state, data: rest };
    }

    case getType(actions.clearError):
      return { ...state, errorMessage: '' };

    case getType(actions.setUserSettingsAsync.request):
      return {
        ...state,
        loading: true,
        errorMessage: '',
      };

    case getType(actions.setUserSettingsAsync.success): {
      return { ...state, userData: action.payload, loading: false, errorMessage: '' };
    }

    case getType(actions.setUserSettingsAsync.failure):
      return { ...state, loading: false, errorMessage: '' };

    default:
      return state;
  }
};

export default reducer;
