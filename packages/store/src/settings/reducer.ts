import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { Settings, IBaseSettings } from '@lib/types';

import { actions, SettingsActionType } from './actions';

import { SettingsState } from './types';

export const baseSettingGroup = { id: 'base', name: 'Настройки приложения', sortOrder: 1 };
export const synchSettingGroup = { id: 'synch', name: 'Синхронизация', sortOrder: 0 };

const baseSettings: Settings<IBaseSettings> = {
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
    sortOrder: 2,
    visible: true,
    group: synchSettingGroup,
    readonly: true,
  },
  autoSynchPeriod: {
    id: 'autoSynchPeriod',
    description: 'Автосинхронизация, мин.',
    data: 10,
    type: 'number',
    sortOrder: 3,
    visible: true,
    group: synchSettingGroup,
  },
  getReferences: {
    id: 'getReferences',
    description: 'Запрашивать справочники',
    data: true,
    type: 'boolean',
    sortOrder: 1,
    visible: true,
    group: baseSettingGroup,
  },
  refLoadType: {
    id: 'refLoadType',
    description: 'Перезаписывать справочники',
    data: true,
    type: 'boolean',
    sortOrder: 2,
    visible: false,
    group: baseSettingGroup,
  },
  cleanDocTime: {
    id: 'cleanDocTime',
    description: 'Хранение документов, дн.',
    data: 60,
    type: 'number',
    sortOrder: 3,
    visible: true,
    group: baseSettingGroup,
  },
};

export const initialState: Readonly<SettingsState> = {
  data: baseSettings,
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
      const newSetts = Object.entries(action.payload).reduce((setts: Settings, [field, newSet]) => {
        const oldRef = state.data[field];
        setts[field] = oldRef ? oldRef : newSet;
        return setts;
      }, {});

      return {
        ...state,
        isInit: false,
        data: { ...state.data, ...newSetts },
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

    default:
      return state;
  }
};

export default reducer;
