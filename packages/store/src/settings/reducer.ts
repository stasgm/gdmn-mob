import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { Settings, IBaseSettings } from '@lib/types';

import { actions, SettingsActionType } from './actions';

import { SettingsState } from './types';

export const baseGroup = { id: '1', name: 'Настройки приложения', sortOrder: 1 };

const baseSettings: Settings<IBaseSettings> = {
  serverAutoCheck: {
    id: '1',
    sortOrder: 1,
    description: 'Опрашивать сервер автоматически',
    data: true,
    type: 'boolean',
    group: baseGroup,
  },
  refLoadType: {
    id: '2',
    description: 'Перезаписывать справочники',
    data: true,
    type: 'boolean',
    sortOrder: 2,
    visible: true,
    group: baseGroup,
  },
  cleanDocTime: {
    id: '3',
    description: 'Время хранения документов в архиве, дн.',
    data: 30,
    type: 'number',
    sortOrder: 3,
    visible: true,
    group: baseGroup,
  },
};

export const initialState: Readonly<SettingsState> = {
  data: baseSettings,
  loading: false,
  loadingData: false,
  loadErrorList: [],
  errorMessage: '',
};

const reducer: Reducer<SettingsState, SettingsActionType> = (state = initialState, action): SettingsState => {
  // console.log('reducer settings', action.type);
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.setLoading):
      return { ...state, loading: action.payload };

    case getType(actions.loadData):
      return { ...action.payload, loading: false, errorMessage: '' };

    case getType(actions.setLoadingData):
      return { ...state, loadingData: action.payload };

    case getType(actions.addOption):
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.optionName]: action.payload.value,
        },
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
