import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { actions, AppTestActionType } from './actions';

import { AppTestState } from './types';

export const initialState: Readonly<AppTestState> = {
  formParams: {},
  loading: false,
};

const reducer: Reducer<AppTestState, AppTestActionType> = (state = initialState, action): AppTestState => {
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.setFormParams):
      return {
        ...state,
        formParams: { ...state.formParams, ...action.payload },
      };

    case getType(actions.clearFormParams):
      return {
        ...state,
        formParams: {},
      };

    default:
      return state;
  }
};

export default reducer;
