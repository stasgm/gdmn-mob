import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { baseSettings } from '@lib/types';

import { actions, SettingsActionType } from './actions';

import { ISettingsState } from './types';

const initialState: Readonly<ISettingsState> = {
  data: baseSettings,
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<ISettingsState, SettingsActionType> = (state = initialState, action): ISettingsState => {
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.updateSettings): {
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.optionName]: action.payload.value,
        },
      };
    }

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
    /*     case getType(actions.fetchMsgAsync.request):
          return { ...state, loading: true };

        case getType(actions.fetchMsgAsync.success):
          return {
            ...state,
            loading: false,
            data: [...state.data, ...action.payload],
          };

        case getType(actions.fetchMsgAsync.failure):
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
