import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { actions, MsgActionType } from './actions';

import { MessagesState } from './types';

const initialState: Readonly<MessagesState> = {
  data: [],
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<MessagesState, MsgActionType> = (state = initialState, action): MessagesState => {
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.updateStatusMessage):
      return {
        ...state,
        data: [...state.data.map((i) => (i.id === action.payload.id ? { ...i, status: action.payload.status } : i))],
      };

    case getType(actions.clearMessagesAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(actions.clearMessagesAsync.success):
      return { ...state, loading: false, data: [] };

    case getType(actions.clearMessagesAsync.failure):
      return { ...state, loading: false, errorMessage: action.payload || 'error' };

    case getType(actions.removeMessageAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(actions.removeMessageAsync.success):
      return { ...state, loading: false, data: [...state.data.filter((i) => i.id !== action.payload)] };

    case getType(actions.removeMessageAsync.failure):
      return { ...state, loading: false, errorMessage: action.payload || 'error' };

    case getType(actions.clearError):
      return { ...state, errorMessage: '' };

    // Loading
    case getType(actions.fetchMessagesAsync.request):
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

    default:
      return state;
  }
};

export default reducer;
