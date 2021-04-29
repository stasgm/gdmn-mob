import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IDocState } from './types';
import { DocActionType, docActions } from './actions';

const initialState: Readonly<IDocState> = {
  docData: [
    {
      id: '1',
      head: {
        number: '225',
        doctype: { id: '1111456', name: 'Заявка1 (организация)' },
        contact: { id: '1', name: 'Рога и копыта' },
        outlet: { id: '11', name: 'Рога и копыта № 123' },
        date: '25.04.2021',
        status: 1,
        ondate: '25.04.2021',
      },
      lines: [{ id: '1', good: { id: '14', name: 'Сосиски докторские' }, quantity: 12 }],
    },
  ],
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<IDocState, DocActionType> = (state = initialState, action): IDocState => {
  switch (action.type) {
    case getType(docActions.init):
      return initialState;

    case getType(docActions.fetchDocsAsync.request):
      return { ...state, loading: true, docData: [] };

    case getType(docActions.fetchDocsAsync.success):
      return {
        ...state,
        loading: false,
        docData: action.payload,
      };

    case getType(docActions.fetchDocsAsync.failure):
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
