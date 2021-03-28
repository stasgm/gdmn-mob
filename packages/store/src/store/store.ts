import { combineReducers, createStore, Reducer, Store, applyMiddleware, compose, StoreEnhancer } from 'redux';
import thunk from 'redux-thunk';
// import logger from 'redux-logger';

import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './rootReducer';
import { IAuthState } from './auth/types';
import reactotron from './ReactotronConfig';

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

const enhancer = reactotron.createEnhancer?.(true) as StoreEnhancer<any, any>;

const composed = __DEV__
  ? compose(enhancer, composeWithDevTools(applyMiddleware(thunk /* , logger */)))
  : applyMiddleware(thunk);

function configureStore() {
  const rootStore: Store = createStore(combineReducers(rootReducer), composed);

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
