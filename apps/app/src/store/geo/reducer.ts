import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { GeoState } from './types';
import { GeoActionType, geoActions } from './actions';

const initialState: Readonly<GeoState> = {
  list: [],
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<GeoState, GeoActionType> = (state = initialState, action): GeoState => {
  switch (action.type) {
    case getType(geoActions.init):
      return initialState;

    case getType(geoActions.addOne): {
      const id = `${(action.payload.coords.latitude % 1).toString().slice(2)}${(action.payload.coords.longitude % 1)
        .toString()
        .slice(2)}`;
      return { ...state, list: [...state.list, { id, ...action.payload }] };
    }

    case getType(geoActions.addCurrent): {
      return {
        ...state,
        list: [...state.list, { id: 'current', name: 'Моё местоположение', ...action.payload, number: 0 }],
      };
    }

    case getType(geoActions.setCurrentPoint): {
      return {
        ...state,
        currentPoint: action.payload,
      };
    }

    case getType(geoActions.addMany): {
      return { ...state, list: action.payload };
    }

    case getType(geoActions.deleteOne):
      return { ...state, list: state.list.filter((item) => item.id !== action.payload) };

    case getType(geoActions.deleteCurrent):
      return { ...state, list: state.list.filter((item) => item.id !== 'current') };

    case getType(geoActions.deleteAll):
      return { ...state, list: [] };

    default:
      return state;
  }
};

export default reducer;
