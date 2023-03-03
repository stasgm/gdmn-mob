import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { actions, AppInventoryActionType } from './actions';

import { AppInventoryState } from './types';

export const initialState: Readonly<AppInventoryState> = {
  model: {},
  unknownGoods: [],
  loading: false,
  loadingData: false,
  errorMessage: '',
  loadingError: '',
};

const reducer: Reducer<AppInventoryState, AppInventoryActionType> = (
  state = initialState,
  action,
): AppInventoryState => {
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.setLoading):
      return { ...state, loading: action.payload };

    case getType(actions.loadData):
      return { ...action.payload, loading: false, errorMessage: '' };

    case getType(actions.setLoadingData):
      return { ...state, loadingData: action.payload };

    case getType(actions.setModelAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(actions.setModelAsync.success):
      return {
        ...state,
        loading: false,
        model: action.payload,
      };

    case getType(actions.setModelAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(actions.setLoadingError):
      return {
        ...state,
        loadingError: action.payload,
      };

    case getType(actions.addUnknownGood):
      return {
        ...state,
        unknownGoods: state.unknownGoods
          .filter((item) => item.good.id !== action.payload.id)
          .concat({ good: action.payload, createdDate: new Date() }),
      };

    case getType(actions.removeOldGood):
      return {
        ...state,
        unknownGoods: state.unknownGoods.filter(
          (item) => new Date(item.createdDate).getTime() > action.payload.getTime(),
        ),
      };

    case getType(actions.removeUnknownGood):
      return {
        ...state,
        unknownGoods: state.unknownGoods.filter((item) => item.good.id !== action.payload),
      };

    default:
      return state;
  }
};

export default reducer;
