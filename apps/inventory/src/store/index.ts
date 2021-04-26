import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { configureStore, RootState } from '@lib/store';

import docsReducer from './docs/reducer';
import refsReducer from './refs/reducer';

export const combinedReducer = {
  docs: docsReducer,
  refs: refsReducer,
};

const rootReducer = combineReducers(combinedReducer);

export const setStore = () => {
  // store.dispatch
  const store = configureStore(combinedReducer);

  return store;
};

export type IAppState = ReturnType<typeof rootReducer> & RootState;
// export type AppDispatch = typeof store.dispatch;

export const useSelector: TypedUseSelectorHook<IAppState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
