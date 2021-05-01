import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { actions, MsgActionType } from './actions';

import { IMessagesState } from './types';

const initialState: Readonly<IMessagesState> = {
  data: [],
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<IMessagesState, MsgActionType> = (state = initialState, action): IMessagesState => {
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.deleteAllMessages):
      return { ...state, data: [] };

    case getType(actions.deleteMessage):
      return { ...state, data: [...state.data.filter((i) => i.id !== action.payload)] };

    // Loading
    case getType(actions.fetchMsgAsync.request):
      return { ...state, loading: true, data: [] };

    case getType(actions.fetchMsgAsync.success):
      return {
        ...state,
        loading: false,
        data: action.payload,
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
