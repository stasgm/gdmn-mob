import { combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { configureStore } from '@lib/store';
import { persistStore } from 'redux-persist';

// import appReducer from './app/reducer';

import { loadDataFromDisk, saveDataToDisk } from '@lib/mobile-app';

import { AppActionType } from './app/actions';

type TActions = AppActionType;

export const reducers = {};

const rootReducer = combineReducers(reducers);

export const { store } = configureStore(loadDataFromDisk, saveDataToDisk, reducers);

export const persistor = persistStore(store);

export type AppState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, AppState, null, Action<any>>;
export type AppDispatch = ThunkDispatch<AppState, any, TActions>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
