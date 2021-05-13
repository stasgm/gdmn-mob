import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { messages } from '@lib/mock';

import { actions, MsgActionType } from './actions';

import { IMessagesState } from './types';

const initialState: Readonly<IMessagesState> = {
  data: messages,
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<IMessagesState, MsgActionType> = (state = initialState, action): IMessagesState => {
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.updateStatusMessage):
      return {
        ...state,
        data: [...state.data.map((i) => (i.id !== action.payload.id ? { ...i, status: action.payload.newStatus } : i))],
      };

    case getType(actions.deleteAllMessages):
      return { ...state, data: [] };

    case getType(actions.deleteMessage):
      return { ...state, data: [...state.data.filter((i) => i.id !== action.payload)] };

    case getType(actions.clearError):
      return { ...state, errorMessage: '' };

    // Loading
    case getType(actions.fetchMsgAsync.request):
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

    default:
      return state;
  }
};

export default reducer;
