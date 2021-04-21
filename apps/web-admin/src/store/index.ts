import { combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { RootState, configureStore } from '@lib/store';

import companyReducer from './company/reducer';
import userReducer from './user/reducer';

export const combinedReducer = {
  companies: companyReducer,
  users: userReducer,
};

const rootReducer = combineReducers(combinedReducer);

export const store = configureStore(combinedReducer);

export type AppState = ReturnType<typeof rootReducer> & RootState;
export type AppThunk = ThunkAction<void, AppState, null, Action<any>>;
export type AppDispatch = typeof store.dispatch;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = useReduxDispatch;

export default store;
