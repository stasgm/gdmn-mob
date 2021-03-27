import { combineReducers, createStore, Reducer, Store, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './rootReducer';
import { IAuthState } from './auth/types';
export { RootState } from './rootReducer';

export type IState = IAuthState;

export interface StoreWithAsyncReducers extends Store {
  asyncReducers?: { [key: string]: Reducer };
  addReducer?: (key: string, asyncReducer: Reducer) => void;
}

function createReducer(asyncReducers: { [key: string]: Reducer } = {}) {
  return combineReducers<any, any>({
    ...rootReducer,
    ...asyncReducers,
  });
}

function configureStore() {
  const rootStore: Store = createStore(combineReducers(rootReducer), composeWithDevTools(applyMiddleware(thunk)));

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

const store = configureStore();

export default store;
