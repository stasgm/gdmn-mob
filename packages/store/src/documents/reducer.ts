import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { DocumentState } from './types';
import { DocumentActionType, actions } from './actions';

const initialState: Readonly<DocumentState> = {
  list: [],
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<DocumentState, DocumentActionType> = (state = initialState, action): DocumentState => {
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.setDocuments):
      return {
        ...state,
        list: action.payload,
      };

    // case getType(actions.deleteDocuments):
    //   return { ...state, list: [] };

    case getType(actions.addDocument):
      return {
        ...state,
        list: [...(state.list || []), action.payload],
      };

    case getType(actions.updateDocument):
      return {
        ...state,
        list: state.list.map((doc) => (doc.id === action.payload.docId ? { ...action.payload.document } : doc)),
      };

    // case getType(actions.removeDocument):
    //   return { ...state, list: state.list.filter((document) => document.id !== action.payload) };

    case getType(actions.clearDocumentsAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(actions.clearDocumentsAsync.success):
      return { ...state, loading: false, list: [] };

    case getType(actions.clearDocumentsAsync.failure):
      return { ...state, loading: false, errorMessage: action.payload || 'error' };

    case getType(actions.removeDocumentAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(actions.removeDocumentAsync.success):
      return { ...state, list: [...state.list.filter((i) => i.id !== action.payload)] };

    case getType(actions.removeDocumentAsync.failure):
      return { ...state, loading: false, errorMessage: action.payload || 'error' };

    case getType(actions.clearError):
      return { ...state, errorMessage: '' };

    //Добавление нескольких документов
    case getType(actions.addDocumentsAsync.request):
      return { ...state, loading: true, errorMessage: '' };

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

    //Позиции документа
    case getType(actions.addDocumentLine): {
      return {
        ...state,
        list: state.list.map((doc) =>
          doc.id === action.payload.docId ? { ...doc, lines: [...(doc.lines || []), action.payload.line] } : doc,
        ),
      };
    }

    case getType(actions.updateDocumentLine):
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

    case getType(actions.deleteDocumentLine):
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
