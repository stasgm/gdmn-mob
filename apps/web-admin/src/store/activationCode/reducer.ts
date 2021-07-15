import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IActivationCodeState } from './types';
import { ActivationCodeActionType, activationCodeActions } from './actions';

const initialState: Readonly<IActivationCodeState> = {
  list: [],
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<IActivationCodeState, ActivationCodeActionType> =
 (state = initialState, action): IActivationCodeState => {
  switch (action.type) {
    case getType(activationCodeActions.init):
      return initialState;

    case getType(activationCodeActions.clearError):
      return { ...state, errorMessage: '' };

    case getType(activationCodeActions.fetchActivationCodesAsync.request):
      return { ...state, loading: true, list: [], errorMessage: '' };

    case getType(activationCodeActions.fetchActivationCodesAsync.success):
      return {
        ...state,
        list: action.payload,
        loading: false,
      };

    case getType(activationCodeActions.fetchActivationCodesAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    // Получение компании
    case getType(activationCodeActions.fetchActivationCodeAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(activationCodeActions.fetchActivationCodeAsync.success):
      return {
        ...state,
        list: [...(state.list?.filter(({ id }) => id !== action.payload.id) || []), action.payload],
        loading: false,
      };

    case getType(activationCodeActions.fetchActivationCodeAsync.failure):
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
