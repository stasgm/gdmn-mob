import thunkMiddleware, { ThunkAction } from 'redux-thunk';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';

import { Action, Reducer, createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import { StateType } from 'typesafe-actions';

import auth from './auth/reducer';

const rootReducer = {
  auth,
};

type AppReducers = { [key: string]: Reducer };

const createReducer = (asyncReducers: AppReducers = {}) => {
  return combineReducers<any, any>({
    ...rootReducer,
    ...asyncReducers,
  });
};

export default function configureStore(appReducers: AppReducers) {
  const middleware = [thunkMiddleware];
  const middleWareEnhancer = applyMiddleware(...middleware);

  const store = createStore(createReducer(appReducers), composeWithDevTools(middleWareEnhancer));
  /*  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers/index').default;

      store.replaceReducer(nextReducer);
    });
  } */
  return store;
}

export type RootState = StateType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, RootState, null, Action<any>>;
export const useDispatch = useReduxDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
