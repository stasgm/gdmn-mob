import { CombinedState, combineReducers } from 'redux';
import { Reducer } from 'react';

import userReducer from './users';

const reducers: Reducer<CombinedState<any>, any> = combineReducers({
  users: userReducer,
});

export default reducers;
