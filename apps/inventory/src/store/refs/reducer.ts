import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IRefState } from './types';
import { RefActionType, refActions } from './actions';

const initialState: Readonly<IRefState> = {
  data: [{ name: 'Магазины' }, { name: 'Товары' }, { name: 'Контакты' }, { name: 'Взвешивания' }],
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<IRefState, RefActionType> = (state = initialState, action): IRefState => {
  switch (action.type) {
    case getType(refActions.init):
      return initialState;

    case getType(refActions.fetchRefsAsync.request):
      return { ...state, loading: true, data: [] };

    case getType(refActions.fetchRefsAsync.success):
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case getType(refActions.fetchRefsAsync.failure):
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
