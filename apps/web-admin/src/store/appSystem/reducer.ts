import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IAppSystemState } from './types';
import { AppSystemActionType, appSystemActions } from './actions';

const initialState: Readonly<IAppSystemState> = {
  list: [],
  loading: false,
  errorMessage: '',
  pageParams: undefined,
};

const reducer: Reducer<IAppSystemState, AppSystemActionType> = (state = initialState, action): IAppSystemState => {
  switch (action.type) {
    case getType(appSystemActions.init):
      return initialState;

    case getType(appSystemActions.clearError):
      return { ...state, errorMessage: '' };

    case getType(appSystemActions.setError):
      return { ...state, errorMessage: 'Сістема уже существует' };

    case getType(appSystemActions.fetchAppSystemsAsync.request):
      return { ...state, loading: true, list: [], errorMessage: '' };

    case getType(appSystemActions.fetchAppSystemsAsync.success):
      return {
        ...state,
        list: action.payload,
        loading: false,
      };

    case getType(appSystemActions.fetchAppSystemsAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    // // Получение компании
    // case getType(companyActions.fetchCompanyAsync.request):
    //   return { ...state, loading: true, errorMessage: '' };

    // case getType(companyActions.fetchCompanyAsync.success):
    //   return {
    //     ...state,
    //     list: [...(state.list?.filter(({ id }) => id !== action.payload.id) || []), action.payload],
    //     loading: false,
    //   };

    // case getType(companyActions.fetchCompanyAsync.failure):
    //   return {
    //     ...state,
    //     loading: false,
    //     errorMessage: action.payload || 'error',
    //   };

    case getType(appSystemActions.setPageParam):
      return {
        ...state,
        pageParams: { ...state.pageParams, ...action.payload },
      };

    case getType(appSystemActions.clearPageParams):
      return {
        ...state,
        pageParams: undefined,
      };

    default:
      return state;
  }
};

export default reducer;
