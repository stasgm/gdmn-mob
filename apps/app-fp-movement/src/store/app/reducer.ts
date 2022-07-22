import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { actions, FpMovementActionType } from './actions';

import { FpMovementState } from './types';

export const initialState: Readonly<FpMovementState> = {
  list: [],
  loading: false,
  loadingData: false,
  errorMessage: '',
  loadingError: '',
};

const reducer: Reducer<FpMovementState, FpMovementActionType> = (state = initialState, action): FpMovementState => {
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.setLoading):
      return { ...state, loading: action.payload };

    case getType(actions.loadData):
      return { ...action.payload, loading: false, errorMessage: '' };

    case getType(actions.setLoadingData):
      return { ...state, loadingData: action.payload };

    case getType(actions.setLoadingError):
      return {
        ...state,
        loadingError: action.payload,
      };

    case getType(actions.addOrder):
      return {
        ...state,
        list: [...(state.list || []), action.payload],
      };

    case getType(actions.updateOrderLine):
      return {
        ...state,
        list: state.list.map((doc) =>
          doc.id === action.payload.docId
            ? {
                ...doc,
                lines: doc?.lines?.map((line) => (line.id === action.payload.line.id ? action.payload.line : line)),
              }
            : doc,
        ),
      };

    case getType(actions.removeOrderLine):
      return {
        ...state,
        list: state.list.map((doc) =>
          doc.id === action.payload.docId
            ? {
                ...doc,
                lines: doc?.lines?.filter((line) => line.id !== action.payload.lineId),
              }
            : doc,
        ),
      };

    default:
      return state;
  }
};

export default reducer;
