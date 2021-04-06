import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector } from 'react-redux';
import { RootState } from '@lib/store';

import docsReducer from './docs/reducer';

export const combinedReducer = {
  docs: docsReducer,
};

const rootReducer = combineReducers(combinedReducer);

export type IAppState = ReturnType<typeof rootReducer> & RootState;

// export type AppDispatch = typeof store.dispatch;

export const useSelector: TypedUseSelectorHook<IAppState> = useReduxSelector;
// export default rootReducer;
