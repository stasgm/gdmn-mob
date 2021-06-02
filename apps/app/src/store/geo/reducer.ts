import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IGeoState, ILocation } from './types';
import { GeoActionType, geoActions } from './actions';

const mock: ILocation[] = [
  { id: '85821947683', name: 'проспект Дзержинского, 106', coords: { latitude: 53.858219, longitude: 27.47683 } },
  { id: '90857548608', name: 'проспект Победителей, 9', coords: { latitude: 53.90857, longitude: 27.548608 } },
  { id: '933698652534', name: 'улица Петра Мстиславца, 11', coords: { latitude: 53.933698, longitude: 27.652534 } },
  { id: '938071488142', name: 'проспект Победителей, 84', coords: { latitude: 53.938071, longitude: 27.488142 } },
];

const initialState: Readonly<IGeoState> = {
  list: mock,
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

    case getType(geoActions.deleteOne):
      return { ...state, list: [...state.list.filter((item) => item.id !== action.payload)] };

    case getType(geoActions.deleteAll):
      return { ...state, list: [] };

    default:
      return state;
  }
};

export default reducer;
