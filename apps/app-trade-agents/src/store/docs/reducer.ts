import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IDocState } from './types';
import { DocActionType, docActions } from './actions';
import { goodRefMock, contact1, outlet1, documentTypeMock } from './mock';

const initialState: Readonly<IDocState> = {
  docData: [
    {
      id: '1',
      number: '6225',
      documentDate: '13.05.2021',
      documentType: documentTypeMock[0],
      status: 'DRAFT',
      head: {
        contact: contact1,
        outlet: outlet1,
        ondate: '25.04.2021',
      },
      lines: [{ id: '1', good: goodRefMock[0], quantity: 12 }],
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
