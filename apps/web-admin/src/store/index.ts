import { combineReducers } from 'redux';

import companyReducer from './company/reducer';

export const combinedReducer = {
  company: companyReducer,
};

const rootReducer = combineReducers(combinedReducer);

export type IAppState = ReturnType<typeof rootReducer>;

export default rootReducer;
