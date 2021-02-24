import { Reducer } from 'react';
import Reactotron from 'reactotron-react-native';

import { IServiceState } from '../../model/types';
import { TServiceActions, ActionServiceTypes } from './actions';

export const initialState: IServiceState = {
  isLoading: false,
  serverUrl: undefined,
  deviceId: undefined,
  storagePath: undefined,
};

export const reducer: Reducer<IServiceState, TServiceActions> = (state = initialState, action): IServiceState => {
  if (__DEV__) {
    // console.log('Service action: ', JSON.stringify(action));
    Reactotron.display({
      name: `Service action ${action.type}`,
      value: action,
      important: false,
    });
  }

  switch (action.type) {
    case ActionServiceTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ActionServiceTypes.SET_SERVER_URL:
      return { ...state, serverUrl: action.payload };
    case ActionServiceTypes.SET_DEVICE_ID:
      return { ...state, deviceId: action.payload };
    case ActionServiceTypes.SET_STORAGE_PATH:
      return { ...state, storagePath: action.payload };
    default:
      return state;
  }
};
