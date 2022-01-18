import { combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { configureStore /* , RootState */ } from '@lib/store';

import docsReducer from './docs/reducer';
import geoReducer from './geo/reducer';
import { DocActionType } from './docs/actions';

type TActions = DocActionType;

export const combinedReducer = {
  docs: docsReducer,
  geo: geoReducer,
};

const rootReducer = combineReducers(combinedReducer);

export const { store } = configureStore(combinedReducer);

export type AppState = ReturnType<typeof rootReducer>; // & RootState;
export type AppThunk = ThunkAction<void, AppState, null, Action<any>>;
// export type AppDispatch = typeof store.dispatch;
export type AppDispatch = ThunkDispatch<AppState, any, TActions>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
