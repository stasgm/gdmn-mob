import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IReference, IReferenceData, IReferences } from '@lib/types';

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

    case getType(actions.setReferencesAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(actions.setReferencesAsync.success):
      return {
        ...state,
        loading: false,
        list: action.payload,
      };

    case getType(actions.setReferencesAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
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
      return { ...state, loading: false, list: rest };
      //return { ...state, list: state.list?.filter(({ name }) => name.toString() !== action.payload) };
    }

    case getType(actions.removeReferenceAsync.failure):
      return { ...state, loading: false, errorMessage: action.payload || 'error' };

    //Добавление нескольких справочников
    case getType(actions.addReferencesAsync.request):
      return { ...state, loading: true };

    case getType(actions.addReferencesAsync.success): {
      const newRefs = Object.entries(action.payload).reduce((refs, [field, newRef]) => {
        const oldRef = state.list[field];
        const ref = {
          ...newRef,
          data: newRef.data.map((r) => {
            const oldItem = oldRef.data.find((i) => i.id === r.id);
            return oldItem ? oldItem : r;
          }),
        };
        return { ...refs, [field]: ref };
      }, {});

      return {
        ...state,
        loading: false,
        list: { ...state.list, ...newRefs },
      };
    }

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
