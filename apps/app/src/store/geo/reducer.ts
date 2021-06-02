import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IGeoState } from './types';
import { GeoActionType, geoActions } from './actions';

const initialState: Readonly<IGeoState> = {
  list: [],
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<IGeoState, GeoActionType> = (state = initialState, action): IGeoState => {
  switch (action.type) {
    case getType(geoActions.init):
      return initialState;

    case getType(geoActions.addOne): {
      const id = `${(action.payload.coords.latitude % 1).toString().slice(2)}${(action.payload.coords.longitude % 1)
        .toString()
        .slice(2)}`;
      return { ...state, list: [...state.list, { id, ...action.payload }] };
    }

    case getType(geoActions.addMany): {
      return { ...state, list: action.payload };
    }

    case getType(geoActions.deleteOne):
      return { ...state, list: [...state.list.filter((item) => item.id !== action.payload)] };

    case getType(geoActions.deleteAll):
      return { ...state, list: [] };

    default:
      return state;
  }
};

export default reducer;
