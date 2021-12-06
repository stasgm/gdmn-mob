import { combineReducers, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { AppDispatch, configureStore } from '@lib/store';
import { persistStore } from 'redux-persist';
import { TypedUseSelectorHook, useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';

import appInventoryReducer from './app/reducer';

export const combinedReducer = {
  appInventory: appInventoryReducer,
};

const rootReducer = combineReducers(combinedReducer);

export const { store } = configureStore(combinedReducer);
export const persistor = persistStore(store);

export type AppState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, AppState, null, Action<any>>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
