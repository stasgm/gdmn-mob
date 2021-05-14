import { combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { configureStore, RootState } from '@lib/store';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';

type TActions = Action<any>;

export const combinedReducer = {};

const rootReducer = combineReducers(combinedReducer);

/* const persistConfig = {
  key: 'auth',
  storage: ExpoFileSystemStorage,
  whitelist: ['auth'],
}; */

export const { store } = configureStore(combinedReducer);
// export const { store, persistor } = configureStore(combinedReducer, persistConfig);

export type AppState = ReturnType<typeof rootReducer> & RootState;
export type AppThunk = ThunkAction<void, AppState, null, Action<any>>;
export type AppDispatch = ThunkDispatch<AppState, any, TActions>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
