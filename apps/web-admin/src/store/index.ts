import { combineReducers } from 'redux';

import companyReducer from './company/reducer';

export const combinedReducer = {
  companies: companyReducer,
};

const rootReducer = combineReducers(combinedReducer);

export type IRootState = ReturnType<typeof rootReducer>;

export default rootReducer;
