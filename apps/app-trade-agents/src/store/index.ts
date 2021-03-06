import { combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { configureStore } from '@lib/store';

import geoReducer from './geo/reducer';
import visitsReducer from './visits/reducer';
import appReducer from './app/reducer';

import { GeoActionType } from './geo/actions';
import { VisitActionType } from './visits/actions';
import { AppActionType } from './app/actions';

type TActions = AppActionType | GeoActionType | VisitActionType;

export const combinedReducer = {
  app: appReducer,
  visits: visitsReducer,
  geo: geoReducer,
};

const rootReducer = combineReducers(combinedReducer);

export const { store } = configureStore(combinedReducer);

export type AppState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, AppState, null, Action<any>>;
export type AppDispatch = ThunkDispatch<AppState, any, TActions>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
