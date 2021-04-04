import { combineReducers } from 'redux';
// import { StateType } from 'typesafe-actions';
import { RootState } from '@lib/store';

import docsReducer from './docs/reducer';

export const combinedReducer = {
  docs: docsReducer,
};

const rootReducer = combineReducers(combinedReducer);

export type IAppState = ReturnType<typeof rootReducer> & RootState;
// export type IAppState = StateType<typeof rootReducer> & RootState;

export default rootReducer;
