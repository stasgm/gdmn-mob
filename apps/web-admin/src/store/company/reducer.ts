import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { ICompanyState } from './types';
import { CompanyActionType, companyActions } from './actions';

const initialState: Readonly<ICompanyState> = {
  list: [],
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<ICompanyState, CompanyActionType> = (state = initialState, action): ICompanyState => {
  switch (action.type) {
    case getType(companyActions.init):
      return initialState;

    case getType(companyActions.clearError):
      return { ...state, errorMessage: '' };

    case getType(companyActions.fetchCompaniesAsync.request):
      return { ...state, loading: true, list: [], errorMessage: '' };

    case getType(companyActions.fetchCompaniesAsync.success):
      return {
        ...state,
        list: action.payload,
        loading: false,
      };

    case getType(companyActions.fetchCompaniesAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(companyActions.addCompanyAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(companyActions.addCompanyAsync.success):
      return {
        ...state,
        list: [...(state.list || []), action.payload],
        loading: false,
      };

    case getType(companyActions.addCompanyAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    // Обновление компании
    case getType(companyActions.updateCompanyAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(companyActions.updateCompanyAsync.success):
      return {
        ...state,
        list: [...(state.list?.filter(({ id }) => id !== action.payload.id) || []), action.payload],
        loading: false,
      };

    case getType(companyActions.updateCompanyAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    // Получение компании
    case getType(companyActions.fetchCompanyAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(companyActions.fetchCompanyAsync.success):
      return {
        ...state,
        list: [...(state.list?.filter(({ id }) => id !== action.payload.id) || []), action.payload],
        loading: false,
      };

    case getType(companyActions.fetchCompanyAsync.failure):
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
