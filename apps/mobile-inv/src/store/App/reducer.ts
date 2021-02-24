import { Reducer } from 'react';
import Reactotron from 'reactotron-react-native';

import { getNextDocLineId } from '../../helpers/utils';
import { IAppState } from '../../model/types';
import { TAppActions, ActionAppTypes } from './actions';

export const initialState: IAppState = {
  settings: undefined,
  companySettings: undefined,
  documents: undefined,
  references: undefined,
  forms: undefined,
  models: undefined,
  viewParams: undefined,
};

export const reducer: Reducer<IAppState, TAppActions> = (state = initialState, action): IAppState => {
  if (__DEV__) {
    // console.log('App action: ', JSON.stringify(action));
    Reactotron.display({
      name: `App action ${action.type}`,
      value: action,
      important: false,
    });
  }

  switch (action.type) {
    case ActionAppTypes.ADD_DOCUMENT: {
      return { ...state, documents: [...(state.documents || []), action.payload] };
    }
    case ActionAppTypes.UPDATE_DOCUMENT_HEAD: {
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.payload.id ? { ...doc, head: action.payload.head } : doc,
        ),
      };
    }
    case ActionAppTypes.UPDATE_DOCUMENT_STATUS: {
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.payload.id ? { ...doc, head: { ...doc.head, status: action.payload.status } } : doc,
        ),
      };
    }
    case ActionAppTypes.DELETE_DOCUMENT:
      return {
        ...state,
        documents: state.documents.filter((document) => document.id !== action.payload),
      };
    case ActionAppTypes.DELETE_ALL_DOCUMENTS:
      return {
        ...state,
        documents: [],
      };
    case ActionAppTypes.DOCUMENT_ADD_LINE: {
      const nextId = getNextDocLineId(state.documents.find((doc) => doc.id === action.payload.docId));

      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.payload.docId
            ? { ...doc, lines: [...doc.lines, { ...action.payload.line, id: nextId }] }
            : doc,
        ),
      };
    }
    case ActionAppTypes.DOCUMENT_DELETE_LINE: {
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.payload.docId
            ? {
                ...doc,
                lines: doc.lines.filter((line) => line.id !== action.payload.lineId),
              }
            : doc,
        ),
      };
    }
    case ActionAppTypes.DOCUMENT_UPDATE_LINE: {
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.payload.docId
            ? {
                ...doc,
                lines: doc.lines.map((line) => (line.id === action.payload.line.id ? action.payload.line : line)),
              }
            : doc,
        ),
      };
    }
    case ActionAppTypes.SET_SETTINGS:
      return { ...state, settings: action.payload };
    case ActionAppTypes.SET_COMPANY_SETTINGS:
      return { ...state, companySettings: action.payload };
    case ActionAppTypes.SET_DOCUMENTS:
      return { ...state, documents: action.payload };
    case ActionAppTypes.SET_REFERENCES:
      return { ...state, references: action.payload };
    case ActionAppTypes.SET_REFERENCE:
      return { ...state, references: { ...state.references, [action.payload.type]: action.payload } };
    case ActionAppTypes.SET_MODELS:
      return { ...state, models: action.payload };
    case ActionAppTypes.SET_MODEL:
      return { ...state, models: { ...state.models, [action.payload.type]: action.payload } };
    case ActionAppTypes.SET_FORM: {
      return {
        ...state,
        forms: { ...state.forms, ...action.payload },
      };
    }
    case ActionAppTypes.CLEAR_FORM: {
      return { ...state, forms: { ...state.forms, [action.payload]: undefined } };
    }
    case ActionAppTypes.SET_VIEWPARAMS:
      return { ...state, viewParams: action.payload };
    case ActionAppTypes.SET_VIEWPARAM:
      return { ...state, viewParams: { ...state.viewParams, ...action.payload } };
    default:
      return state;
  }
};
