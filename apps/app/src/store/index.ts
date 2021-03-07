import AsyncStorage from '@react-native-community/async-storage';
import { applyMiddleware, compose, createStore, Dispatch, MiddlewareAPI } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';

import { Userstate } from './users/types';

import rootReducer from './rootReducer';

export interface ApplicationState {
  users: Userstate;
}

const config = {
  storage: AsyncStorage,
  key: 'user',
};

const reducers = persistReducer(config, rootReducer);

const appMiddleware = (_store: MiddlewareAPI) => (next: Dispatch) => (action: any) => {
  // console.log(_store.getState());
  next(action);
};

const middlewares = [appMiddleware];
const enhancers = [applyMiddleware(...middlewares)];

export const store = createStore(reducers, compose(...enhancers));

export const persistor = persistStore(store);
