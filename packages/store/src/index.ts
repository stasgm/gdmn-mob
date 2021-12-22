import thunkMiddleware, { ThunkDispatch } from 'redux-thunk';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { Reducer, createStore, combineReducers, applyMiddleware, AnyAction } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { StateType } from 'typesafe-actions';

import { reducer as documentReducer } from './documents';
import { reducer as authReducer } from './auth';
import { reducer as referenceReducer } from './references';
import { reducer as settingsReducer } from './settings';
import { reducer as msgReducer } from './messages';
import { reducer as appReducer } from './app';
import { TActions } from './types';
import { authMiddleware } from './auth/middleware';
import { documentMiddleware } from './documents/middleware';
import { referenceMiddleware } from './references/middleware';
import { settingMiddleware } from './settings/middleware';

// const persistConfig = {
//   key: 'config',
//   storage: UserAsyncStorage,
// };

// const persistAuthConfig = {
//   key: 'auth',
//   storage: UserAsyncStorage,
//   whitelist: ['user', 'settings', 'company', 'device', 'isDemo'],
// };

// const persistDocsConfig = {
//   key: 'documents',
//   storage: UserAsyncStorage,
//   whitelist: ['list'],
// };

// const persistRefsConfig = {
//   key: 'references',
//   storage: UserAsyncStorage,
//   whitelist: ['list'],
// };

// const persistSettingsConfig = {
//   key: 'settings',
//   storage: UserAsyncStorage,
//   whitelist: ['data'],
// };

// const persistAppConfig = {
//   key: 'app',
//   storage: UserAsyncStorage,
//   whitelist: ['formParams', 'errorList'],
// };

// export const rootReducer = {
//   // config: persistReducer(persistConfig, configReducer),
//   auth: persistReducer(persistAuthConfig, authReducer),
//   messages: msgReducer,
//   references: persistReducer(persistRefsConfig, referenceReducer),
//   documents: persistReducer(persistDocsConfig, documentReducer),
//   settings: persistReducer(persistSettingsConfig, settingsReducer),
//   app: persistReducer(persistAppConfig, appReducer),
// };

export const rootReducer = {
  // config: persistReducer(persistConfig, configReducer),
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

// <S, A extends AnyAction>
export const configureStore = (appReducers: AppReducers<any, AnyAction>, middlewares: any) => {
  console.log('configureStore');
  const middleware = [
    thunkMiddleware,
    authMiddleware,
    documentMiddleware,
    referenceMiddleware,
    settingMiddleware,
    ...middlewares,
  ];
  const middleWareEnhancer = applyMiddleware(...middleware);

  const store = createStore(createReducer(appReducers), composeWithDevTools(middleWareEnhancer));
  // const store = loadState()
  //   .then((state: any) => {
  //     console.log('loadState', state.auth?.user?.id, state.documents?.list?.length);
  //     const store = createStore(createReducer(appReducers), state, composeWithDevTools(middleWareEnhancer));
  //     return store;
  //   })
  //   .then((store) => {
  //     store.subscribe(
  //       throttle(() => {
  //         const state = store.getState();
  //         // if (!state.auth.user) {
  //         //   saveState(state);
  //         //   return;
  //         // }
  //         // const userId = state.auth.user.id;
  //         // const userStore = Object.entries(state).reduce((prev: any, cur: any) => {
  //         //   prev[`${userId}/${cur[0]}`] = cur[1];
  //         //   return prev;
  //         // }, {});
  //         console.log('saveState');
  //         saveState(state);
  //       }, 1000),
  //     );
  //     return store;
  //   });
  return { store };
};

export type RootState = StateType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, any, TActions>; // TActions

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
