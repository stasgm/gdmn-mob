import { combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { configureStore, RootState } from '@lib/store';

import docsReducer from './docs/reducer';

export const combinedReducer = {
  docs: docsReducer,
};

const rootReducer = combineReducers(combinedReducer);

export const { store, persistor } = configureStore(combinedReducer);

export type AppState = ReturnType<typeof rootReducer> & RootState;
export type AppThunk = ThunkAction<void, AppState, null, Action<any>>;
export type AppDispatch = typeof store.dispatch;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
