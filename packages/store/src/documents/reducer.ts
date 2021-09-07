import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { StatusType } from '@lib/types';

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

    case getType(actions.setDocumentsAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(actions.setDocumentsAsync.success): {
      const docsFromBack = action.payload;

      //Документы, которые есть только в мобильном
      const oldDocs = state.list.filter((oldDoc) => !docsFromBack.find((d) => d.id === oldDoc.id));

      // Отфильтруем документы, которых по какой-то причине нет в мобильном, но пришел ответ от сервера
      // и сформируем новый массив:
      // - Если пришел новый документ (не ответ), то записываем его
      // - Если пришел успешный ответ 'PROCESSED' от сервера,
      //   то оставляем данные из хранилища и заменяем статус на 'PROCESSED' (документы отобразятся на закладке Архив)
      // - Если пришли ответы с ошибками 'PROCESSED_DEADLOCK' или 'PROCESSED_INCORRECT',
      //   то оставляем данные из хранилища, записываем ошибку из errorMessage
      //   и заменяем статус на 'DRAFT' (чтобы пользователь заново смог отредактировать данный документ)
      // - Если документ в хранилище в состоянии черновика,
      //   то заменяем его на новые данные из сообщения,
      //   иначе (состояние Готов или Отправлен) - оставляем данные из хранилища
      // К сформированному массиву добавим документы из хранилища, которых не было в сообщении
      const newDocs = docsFromBack
        .filter(
          (d) =>
            !state.list.find((l) => l.id === d.id) &&
            d.status !== 'PROCESSED' &&
            d.status !== 'PROCESSED_DEADLOCK' &&
            d.status !== 'PROCESSED_INCORRECT',
        )
        .map((newDoc) => {
          const oldDoc = state.list.find((d) => d.id === newDoc.id);

          return !oldDoc
            ? newDoc
            : newDoc.status === 'PROCESSED'
            ? {
                ...oldDoc,
                status: 'PROCESSED' as StatusType,
              }
            : newDoc.status === 'PROCESSED_DEADLOCK' || newDoc.status === 'PROCESSED_INCORRECT'
            ? {
                ...oldDoc,
                status: 'DRAFT' as StatusType,
                errorMessage: newDoc.errorMessage,
              }
            : oldDoc.status === 'DRAFT'
            ? newDoc
            : oldDoc;
        })
        .concat(oldDocs);

      return {
        ...state,
        loading: false,
        list: newDocs,
      };
    }

    case getType(actions.setDocumentsAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    case getType(actions.updateDocumentsAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(actions.updateDocumentsAsync.success):
      return {
        ...state,
        loading: false,
        list: state.list.map((doc) => action.payload.find((d) => d.id === doc.id) || doc),
      };

    case getType(actions.updateDocumentsAsync.failure):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload || 'error',
      };

    // case getType(actions.setDocuments):
    //   return {
    //     ...state,
    //     list: action.payload.map((doc) => state.list.find((d) => d.id === doc.id && d.status !== 'DRAFT') || doc),
    //   };

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

    case getType(actions.clearDocumentsAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(actions.clearDocumentsAsync.success):
      return { ...state, loading: false, list: [] };

    case getType(actions.clearDocumentsAsync.failure):
      return { ...state, loading: false, errorMessage: action.payload || 'error' };

    case getType(actions.removeDocument):
      return { ...state, loading: false, list: state.list.filter((i) => i.id !== action.payload) };

    case getType(actions.removeDocumentsAsync.request):
      return { ...state, loading: true, errorMessage: '' };

    case getType(actions.removeDocumentsAsync.success):
      return {
        ...state,
        loading: false,
        list: state.list.filter((doc) => action.payload.indexOf(doc.id) === -1),
      };

    case getType(actions.removeDocumentsAsync.failure):
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
