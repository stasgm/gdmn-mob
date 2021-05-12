import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IDocumentState } from './types';
import { DocumentActionType, actions } from './actions';

const initialState: Readonly<IDocumentState> = {
  list: [{ number: 1 }],
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<IDocumentState, DocumentActionType> = (state = initialState, action): IDocumentState => {
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.updateList):
      return {
        ...state,
        list: action.payload,
      };

    case getType(actions.deleteDocument):
      return { ...state, list: state.list?.filter(({ number }) => number.toString() !== action.payload) };

    case getType(actions.deleteAllDocuments):
      return { ...state, list: [] };

    case getType(actions.clearError):
      return { ...state, errorMessage: '' };

    //Добавление нескольких документов
    case getType(actions.addDocumentsAsync.request):
      return { ...state, loading: true };

    case getType(actions.addDocumentsAsync.success):
      return {
        ...state,
        loading: false,
        list: [...state.list, ...action.payload],
      };

    case getType(actions.addDocumentsAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    //Добавление одного документа
    case getType(actions.addDocumentAsync.request):
      return { ...state, loading: true };

    case getType(actions.addDocumentAsync.success):
      return {
        ...state,
        loading: false,
        list: [...state.list, action.payload],
      };

    case getType(actions.addDocumentAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    default:
      return state;
  }
};

export default reducer;
