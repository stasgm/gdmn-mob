import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { RootState, configureStore } from '@lib/store';

import companyReducer from './company/reducer';
/* import { CompanyActionType } from './company/actions';
import AsyncActions from './company/actions.async'; */

export const combinedReducer = {
  companies: companyReducer,
};

const rootReducer = combineReducers(combinedReducer);

export type IAppState = ReturnType<typeof rootReducer> & RootState;

// type Actions = CompanyActionType & typeof AsyncActions;

// export const useDispatch = () => useReduxDispatch<Actions>();
export const useDispatch = useReduxDispatch;
export const useSelector: TypedUseSelectorHook<IAppState> = useReduxSelector;

export const setStore = () => {
  // store.dispatch
  const store = configureStore(combinedReducer);

  // useAddReducer({ name: 'companies', reducer: combinedReducer.companies, store });

  return store;
};
