import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector } from 'react-redux';
import { RootState } from '@lib/store';

import companyReducer from './company/reducer';

export const combinedReducer = {
  companies: companyReducer,
};

const rootReducer = combineReducers(combinedReducer);

export type IAppState = ReturnType<typeof rootReducer> & RootState;

export const useSelector: TypedUseSelectorHook<IAppState> = useReduxSelector;
