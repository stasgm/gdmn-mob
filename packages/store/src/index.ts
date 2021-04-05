import thunkMiddleware from 'redux-thunk';

import { createStore, combineReducers, applyMiddleware, Reducer, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import { StateType } from 'typesafe-actions';

import auth from './auth/reducer';

/* const rootReducer = combineReducers({
  auth,
});

export type RootState = ReturnType<typeof rootReducer>;
 */
const rootReducer = {
  auth,
};

export type RootState = StateType<typeof rootReducer>;

export interface StoreWithAsyncReducers extends Store {
  asyncReducers?: { [key: string]: Reducer };
  addReducer?: (key: string, asyncReducer: Reducer) => void;
}

const createReducer = (asyncReducers: { [key: string]: Reducer } = {}) => {
  return combineReducers<any, any>({
    ...rootReducer,
    ...asyncReducers,
  });
};

export default function configureStore() {
  const middleware = [thunkMiddleware];
  const middleWareEnhancer = applyMiddleware(...middleware);
  const rootStore: Store = createStore(combineReducers(rootReducer), composeWithDevTools(middleWareEnhancer));

  const store: StoreWithAsyncReducers = {
    ...rootStore,
    asyncReducers: {},
    addReducer: (key, asyncReducer) => {
      if (!store || !key || !store.asyncReducers) {
        return;
      }
      store.asyncReducers[key] = asyncReducer;
      store.replaceReducer(createReducer(store.asyncReducers));
    },
  };
  return store;
}
