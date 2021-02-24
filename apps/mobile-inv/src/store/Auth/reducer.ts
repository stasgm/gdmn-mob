import { Reducer } from 'react';
import Reactotron from 'reactotron-react-native';

import { IAuthState } from '../../model/types';
import { TAuthActions, ActionAuthTypes } from './actions';

export const initialState: IAuthState = {
  deviceRegistered: undefined,
  userID: undefined,
  companyID: undefined,
  profile: undefined,
};

export const reducer: Reducer<IAuthState, TAuthActions> = (state = initialState, action): IAuthState => {
  if (__DEV__) {
    // console.log('Auth action: ', JSON.stringify(action));
    Reactotron.display({
      name: `Auth action ${action.type}`,
      value: action,
      important: false,
    });
  }

  switch (action.type) {
    case ActionAuthTypes.DISCONNECT:
      return initialState;
    case ActionAuthTypes.LOG_OUT:
      return { ...state, userID: null, companyID: null, profile: undefined };
    case ActionAuthTypes.SET_DEVICE_STATUS:
      return { ...state, deviceRegistered: action.payload };
    case ActionAuthTypes.SET_USER_STATUS:
      return {
        ...state,
        userID: action.payload?.userID,
        profile: { ...state.profile, userName: action.payload?.userName },
      };
    case ActionAuthTypes.SET_COMPANY_ID:
      return {
        ...state,
        companyID: action.payload.companyId,
        profile: { ...state.profile, companyName: action.payload?.companyName },
      };
    default:
      return state;
  }
};
