import thunkMiddleware, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { Action, Reducer, createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { StateType } from 'typesafe-actions';

import { reducer as documentReducer, DocumentActionType } from './documents';

import { reducer as authReducer, AuthActionType } from './auth';
import { reducer as msgReducer, MsgActionType } from './messages';
import { reducer as referenceReducer, ReferenceActionType } from './references';

const rootReducer = {
  auth: authReducer,
  messages: msgReducer,
  references: referenceReducer,
  documents: documentReducer,
};

type AppReducers = { [key: string]: Reducer };

const createReducer = (asyncReducers: AppReducers = {}) => {
  return combineReducers<any, any>({
    ...rootReducer,
    ...asyncReducers,
  });
};

interface IPersostConfig {
  key: string;
  storage: any;
  whitelist: string[];
}

const defaultPersistConfig: IPersostConfig = {
  key: 'auth',
  storage: storage, //TODO для react native надо использовать AsyncStorage  https://github.com/rt2zz/redux-persist
  whitelist: ['auth'],
};

type TActions = AuthActionType | MsgActionType | ReferenceActionType | DocumentActionType;

export default function configureStore(appReducers: AppReducers, persistConfig: IPersostConfig = defaultPersistConfig) {
  const middleware = [thunkMiddleware];
  const middleWareEnhancer = applyMiddleware(...middleware);

  const pReducer = persistReducer(persistConfig, createReducer(appReducers));

  const store = createStore(pReducer, composeWithDevTools(middleWareEnhancer));

  const persistor = persistStore(store);

  return { store, persistor };
}

export type RootState = StateType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, RootState, null, Action<any>>;
export type AppDispatch = ThunkDispatch<RootState, any, TActions>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
