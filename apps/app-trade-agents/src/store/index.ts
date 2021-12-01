import { combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { configureStore } from '@lib/store';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

import geoReducer from './geo/reducer';
import { GeoActionType } from './geo/actions';
import appTradeReducer from './app-trade/reducer';

// export { default as geoActions } from './geo';
// export { useGeoThunkDispatch } from './geo';

type TActions = GeoActionType;

const persistGeoConfig = {
  key: 'geo',
  storage: AsyncStorage,
  whitelist: ['list'],
};

export const combinedReducer = {
  appTrade: appTradeReducer,
  //visits: persistReducer(persistVisitsConfig, visitsReducer),
  geo: persistReducer(persistGeoConfig, geoReducer),
};

const rootReducer = combineReducers(combinedReducer);

export const { store } = configureStore(combinedReducer);
export const persistor = persistStore(store);

export type AppState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, AppState, null, Action<any>>;
export type AppDispatch = ThunkDispatch<AppState, any, TActions>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
