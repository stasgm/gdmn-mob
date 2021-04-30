import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IDocState } from './types';
import { DocActionType, docActions } from './actions';

const initialState: Readonly<IDocState> = {
  list: [{ number: 1 }, { number: 3 }, { number: 6 }, { number: 10 }],
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<IDocState, DocActionType> = (state = initialState, action): IDocState => {
  switch (action.type) {
    case getType(docActions.init):
      return initialState;

    case getType(docActions.fetchDocsAsync.request):
      return { ...state, loading: true, list: [] };

    case getType(docActions.fetchDocsAsync.success):
      return {
        ...state,
        loading: false,
        list: action.payload,
      };

    case getType(docActions.fetchDocsAsync.failure):
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
