import { StateType } from 'typesafe-actions';

import authReducer from './auth/reducer';

const rootReducer = {
  auth: authReducer,
};

export type RootState = StateType<typeof rootReducer>;

export default rootReducer;
