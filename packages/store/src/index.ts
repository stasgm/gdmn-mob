import thunkMiddleware, { ThunkDispatch } from 'redux-thunk';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { Reducer, createStore, combineReducers, applyMiddleware, AnyAction } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { StateType } from 'typesafe-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { persistReducer } from 'redux-persist';

import { reducer as documentReducer } from './documents';
import { reducer as authReducer } from './auth';
import { reducer as msgReducer } from './messages';
import { reducer as referenceReducer } from './references';
import { reducer as settingsReducer } from './settings';
import { TActions } from './types';

const persistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['user', 'settings', 'company'],
};

export const rootReducer = {
  auth: persistReducer(persistConfig, authReducer),
  // auth: authReducer,
  messages: msgReducer,
  references: referenceReducer,
  documents: documentReducer,
  settings: settingsReducer,
};

type AppReducers<S, A extends AnyAction> = { [key: string]: Reducer<S, A> };

const createReducer = <S, A extends AnyAction>(asyncReducers: AppReducers<S, A>) => {
  return combineReducers({ ...rootReducer, ...asyncReducers });
};

// <S, A extends AnyAction>
export default function configureStore(appReducers: AppReducers<any, AnyAction>) {
  const middleware = [thunkMiddleware];
  const middleWareEnhancer = applyMiddleware(...middleware);

  const store = createStore(createReducer(appReducers), composeWithDevTools(middleWareEnhancer));
  return { store };
}

export type RootState = StateType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, any, TActions>; // TActions

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
