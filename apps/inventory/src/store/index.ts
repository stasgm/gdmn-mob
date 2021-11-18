import { combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { configureStore } from '@lib/store';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, } from 'redux-persist';

type TActions = Action<any>;

export const combinedReducer = {};

const rootReducer = combineReducers(combinedReducer);

export const { store } = configureStore(combinedReducer);
export const persistor = persistStore(store);

export type AppState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, AppState, null, Action<any>>;
export type AppDispatch = ThunkDispatch<AppState, any, TActions>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
