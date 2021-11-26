import { combineReducers, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { configureStore } from '@lib/store';
import { persistStore } from 'redux-persist';

export const combinedReducer = {};

const rootReducer = combineReducers(combinedReducer);

export const { store } = configureStore(combinedReducer);
export const persistor = persistStore(store);

export type AppState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, AppState, null, Action<any>>;
