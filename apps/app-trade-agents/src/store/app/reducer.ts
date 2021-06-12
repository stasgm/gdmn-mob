import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { appActions, AppActionType } from './actions';
import { IAppState } from './types';

const initialState: Readonly<IAppState> = {
  formParams: {},
};

const reducer: Reducer<IAppState, AppActionType> = (state = initialState, action): IAppState => {
  switch (action.type) {
    case getType(appActions.init):
      return initialState;

    case getType(appActions.setFormParams):
      return {
        ...state,
        formParams: { ...state.formParams, ...action.payload },
      };

    case getType(appActions.cleanFormParams):
      return {
        ...state,
        formParams: {},
      };

    default:
      return state;
  }
};

export default reducer;
