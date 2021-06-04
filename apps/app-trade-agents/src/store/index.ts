import { combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { configureStore } from '@lib/store';

import geoReducer from './geo/reducer';
import docsReducer from './docs/reducer';
import visitsReducer from './visits/reducer';

import { DocActionType } from './docs/actions';
import { GeoActionType } from './geo/actions';
import { VisitActionType } from './visits/actions';

type TActions = DocActionType | GeoActionType | VisitActionType;

export const combinedReducer = {
  docs: docsReducer,
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
