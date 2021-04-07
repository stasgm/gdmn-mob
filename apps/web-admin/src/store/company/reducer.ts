import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { ICompanyState } from './types';
import { CompanyActionType, companyActions } from './actions';

const initialState: Readonly<ICompanyState> = {
  companyData: [
    { id: '1', title: 'Company 1', admin: 'admin' },
    // { id: '2', title: 'Company 2', admin: 'admin' },
    // { id: '3', title: 'Company 3', admin: 'admin' },
    // { id: '4', title: 'Company 4', admin: 'admin' },
  ],
  companyId: '',
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<ICompanyState, CompanyActionType> = (state = initialState, action): ICompanyState => {
  switch (action.type) {
    case getType(companyActions.init):
      return initialState;

    case getType(companyActions.fetchCompaniesAsync.request):
      return { ...state, loading: true, companyData: [] };

    case getType(companyActions.fetchCompaniesAsync.success):
      return {
        ...state,
        loading: false,
        companyData: action.payload,
      };

    case getType(companyActions.fetchCompaniesAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(companyActions.addCompanyAsync.request):
      return { ...state, loading: true, companyId: undefined };

    case getType(companyActions.addCompanyAsync.success):
      return {
        ...state,
        loading: false,
        companyId: action.payload,
      };

    case getType(companyActions.addCompanyAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(companyActions.updateCompanyAsync.request):
      return { ...state, loading: true };

    case getType(companyActions.updateCompanyAsync.success):
      return {
        ...state,
        loading: false,
      };

    case getType(companyActions.updateCompanyAsync.failure):
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
