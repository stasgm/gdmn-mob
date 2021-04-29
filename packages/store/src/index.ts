import thunkMiddleware, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { Action, Reducer, createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { StateType } from 'typesafe-actions';

import authReducer from './auth/reducer';
import { AuthActionType } from './auth/actions';

const rootReducer = {
  auth: authReducer,
};

type AppReducers = { [key: string]: Reducer };

//const rootReducer = combinedReducer; //combineReducers(combinedReducer);

const createReducer = (asyncReducers: AppReducers = {}) => {
  return combineReducers<any, any>({
    ...rootReducer,
    ...asyncReducers,
  });
};

const persistConfig = {
  key: 'auth',
  storage: storage,
  whitelist: ['auth'],
};

export default function configureStore(appReducers: AppReducers) {
  const middleware = [thunkMiddleware];
  const middleWareEnhancer = applyMiddleware(...middleware);

  const pReducer = persistReducer(persistConfig, createReducer(appReducers));

  const store = createStore(pReducer, composeWithDevTools(middleWareEnhancer));
  // return persistStore(store);

  const persistor = persistStore(store);
  return { store, persistor };

  // return createStore(createReducer(appReducers), composeWithDevTools(middleWareEnhancer));
}

export type RootState = StateType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, RootState, null, Action<any>>;
export type AppDispatch = ThunkDispatch<RootState, any, AuthActionType>;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
