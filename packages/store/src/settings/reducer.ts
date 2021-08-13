import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { ISettings, IBaseSettings } from '@lib/types';

import { actions, SettingsActionType } from './actions';

import { SettingsState } from './types';

const baseSettings: ISettings<IBaseSettings> = {
  serverAutoCheck: {
    id: '1',
    sortOrder: 1,
    description: 'Опрашивать сервер автоматически',
    data: true,
    type: 'boolean',
  },
  refLoadType: {
    id: '2',
    description: 'Перезаписывать справочники',
    data: true,
    type: 'boolean',
    sortOrder: 2,
    visible: true,
  },
  cleanDocTime: {
    id: '3',
    description: 'Время хранения документов в архиве, дн.',
    data: 30,
    type: 'number',
    sortOrder: 3,
    visible: true,
  },
};

const initialState: Readonly<SettingsState> = {
  data: baseSettings,
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<SettingsState, SettingsActionType> = (state = initialState, action): SettingsState => {
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.updateSettings):
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.optionName]: action.payload.value,
        },
      };

    case getType(actions.deleteAllSettings):
      return { ...state, data: {} };

    case getType(actions.deleteSettingsOption): {
      const removeProps = action.payload;
      // state.data[action.payload];
      const { [removeProps]: remove, ...rest } = state.data;
      return { ...state, data: rest };
    }

    case getType(actions.clearError):
      return { ...state, errorMessage: '' };

    // Loading
    /*     case getType(actions.fetchMessagesAsync.request):
          return { ...state, loading: true };

        case getType(actions.fetchMessagesAsync.success):
          return {
            ...state,
            loading: false,
            data: [...state.data, ...action.payload],
          };

        case getType(actions.fetchMessagesAsync.failure):
          return {
            ...state,
            loading: false,
            errorMessage: action.payload || 'error',
          };
     */
    default:
      return state;
  }
};

export default reducer;
