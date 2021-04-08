import thunkMiddleware from 'redux-thunk';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';

import { createStore, combineReducers, applyMiddleware, Reducer } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import { StateType } from 'typesafe-actions';

import auth from './auth/reducer';

const rootReducer = {
  auth,
};

export type RootState = StateType<typeof rootReducer>;

/* export interface StoreWithAsyncReducers extends Store {
  asyncReducers?: { [key: string]: Reducer };
  addReducer?: (key: string, asyncReducer: Reducer) => void;
}
 */
type AppReducers = { [key: string]: Reducer };

const createReducer = (asyncReducers: AppReducers = {}) => {
  return combineReducers<any, any>({
    ...rootReducer,
    ...asyncReducers,
  });
};

/* export function configureStore2() {
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
} */

export default function configureStore(appReducers: AppReducers) {
  const middleware = [thunkMiddleware];
  const middleWareEnhancer = applyMiddleware(...middleware);

  return createStore(createReducer(appReducers), composeWithDevTools(middleWareEnhancer));

  /*   const store: StoreWithAsyncReducers = {
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
  return store;*/
}

export const useDispatch = useReduxDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
