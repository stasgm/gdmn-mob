import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { ReferenceState } from './types';
import { ReferenceActionType, actions } from './actions';

const initialState: Readonly<ReferenceState> = {
  list: {},
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<ReferenceState, ReferenceActionType> = (state = initialState, action): ReferenceState => {
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

    case getType(actions.clearReferencesAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(actions.clearReferencesAsync.success):
      return { ...state, loading: false, list: {} };

    case getType(actions.clearReferencesAsync.failure):
      return { ...state, loading: false, errorMessage: action.payload || 'error' };

    case getType(actions.removeReferenceAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(actions.removeReferenceAsync.success): {
      const { [action.payload]: _, ...rest } = state.list;
      return { ...state, list: rest };
      //return { ...state, list: state.list?.filter(({ name }) => name.toString() !== action.payload) };
    }

    case getType(actions.removeReferenceAsync.failure):
      return { ...state, loading: false, errorMessage: action.payload || 'error' };

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
