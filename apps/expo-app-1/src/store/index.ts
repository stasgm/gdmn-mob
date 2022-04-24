import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
// import logger from 'redux-logger'

import todoReducer from '../features/todos/store';

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    todos: todoReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;

type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
