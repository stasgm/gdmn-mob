import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IReferenceState } from './types';
import { ReferenceActionType, actions } from './actions';

const initialState: Readonly<IReferenceState> = {
  list: {},
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<IReferenceState, ReferenceActionType> = (state = initialState, action): IReferenceState => {
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.updateList):
      return {
        ...state,
        list: action.payload,
      };

    case getType(actions.deleteReference): {
      const { [action.payload]: _, ...rest } = state.list;
      return { ...state, list: rest };
      //return { ...state, list: state.list?.filter(({ name }) => name.toString() !== action.payload) };
    }

    case getType(actions.deleteAllReferences):
      return { ...state, list: {} };

    case getType(actions.clearError):
      return { ...state, errorMessage: '' };

    //Добавление нескольких справочников
    case getType(actions.addReferencesAsync.request):
      return { ...state, loading: true };

    case getType(actions.addReferencesAsync.success):
      return {
        ...state,
        loading: false,
        list: { ...state.list, ...action.payload },
      };

    case getType(actions.addReferencesAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    //Добавление одного справочника
    /*case getType(actions.addReferenceAsync.request):
      return { ...state, loading: true };

    case getType(actions.addReferenceAsync.success):
      return {
        ...state,
        loading: false,
        list: [...state.list, action.payload],
      };

    case getType(actions.addReferenceAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };
*/
    default:
      return state;
  }
};

export default reducer;
