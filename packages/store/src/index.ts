/* eslint-disable prettier/prettier */
import thunkMiddleware, { ThunkDispatch } from 'redux-thunk';
import {
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
  useDispatch as useReduxDispatch,
  useStore,
} from 'react-redux';
import { Reducer, createStore, combineReducers, applyMiddleware, AnyAction } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import { StateType } from 'typesafe-actions';

import { reducer as documentReducer } from './documents';
import { reducer as authReducer } from './auth';
import { reducer as referenceReducer } from './references';
import { reducer as settingsReducer } from './settings';
import { reducer as msgReducer } from './messages';
import { reducer as appReducer } from './app';
import { LoadDataFromDisk, PersistedMiddleware, SaveDataToDisk, TActions } from './types';
import { authMiddlewareFactory } from './auth/middleware';
import { documentMiddlewareFactory } from './documents/middleware';
import { referenceMiddlewareFactory } from './references/middleware';
import { appMiddlewareFactory } from './app/middleware';
import { settingMiddlewareFactory } from './settings/middleware';
import { mesMiddlewareFactory } from './messages/middleware';

export const rootReducer = {
  auth: authReducer,
  messages: msgReducer,
  references: referenceReducer,
  documents: documentReducer,
  settings: settingsReducer,
  app: appReducer,
};

type AppReducers<S, A extends AnyAction> = { [key: string]: Reducer<S, A> };

const createReducer = <S, A extends AnyAction>(asyncReducers: AppReducers<S, A>) => {
  return combineReducers({ ...rootReducer, ...asyncReducers });
};

export const configureStore = (
  load: LoadDataFromDisk,
  save: SaveDataToDisk,
  appReducers: AppReducers<any, AnyAction>,
  appMiddlewares: any[] = [],
  persistedMiddlewares: PersistedMiddleware[] = [],
) => {
  const corePersistedMiddlewares = [
    documentMiddlewareFactory,
    authMiddlewareFactory,
    referenceMiddlewareFactory,
    settingMiddlewareFactory,
    appMiddlewareFactory,
    mesMiddlewareFactory,
  ];

  const middleware = [
    thunkMiddleware,
    ...[...corePersistedMiddlewares, ...persistedMiddlewares].map((m) => m(load, save)),
    ...appMiddlewares,
  ];
  const middleWareEnhancer = applyMiddleware(...middleware);
  const combinedReducer = createReducer(appReducers);

  const store = createStore(combinedReducer, composeWithDevTools(middleWareEnhancer));

  return { store };
};

export type RootState = StateType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, any, TActions>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
export const useAppStore = useStore;
