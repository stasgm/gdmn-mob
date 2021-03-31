import { RootState } from '@lib/store';
import { StateType } from 'typesafe-actions';

import docsReducer from './docs/reducer';

const rootReducer = {
  docs: docsReducer,
};

export type IAppState = StateType<typeof rootReducer> & RootState;

export default rootReducer;
