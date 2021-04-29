import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { mesActions, MesActionType } from './actions';

import { IMesState } from './types';

const initialState: Readonly<IMesState> = {
  data: [],
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<IMesState, MesActionType> = (state = initialState, action): IMesState => {
  switch (action.type) {
    case getType(mesActions.init):
      return initialState;

    case getType(mesActions.fetchMessAsync.request):
      return { ...state, loading: true, data: [] };

    case getType(mesActions.fetchMessAsync.success):
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case getType(mesActions.fetchMessAsync.failure):
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
