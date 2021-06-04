import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { IVisitState } from './types';
import { VisitActionType, visitActions } from './actions';

const initialState: Readonly<IVisitState> = {
  list: [],
  loading: false,
  errorMessage: '',
};

const reducer: Reducer<IVisitState, VisitActionType> = (state = initialState, action): IVisitState => {
  switch (action.type) {
    case getType(visitActions.init):
      return initialState;

    case getType(visitActions.addOne):
      return { ...state, list: [...state.list, action.payload] };

    case getType(visitActions.edit): {
      const oldVisit = state.list.find((visit) => visit.id === action.payload.id);
      // console.log('oldVisit', oldVisit);
      const newList = !oldVisit
        ? state.list
        : [...state.list.filter((visit) => visit.id !== action.payload.id), { ...oldVisit, ...action.payload }];
      // console.log('newList', newList);
      return { ...state, list: newList };
    }

    default:
      return state;
  }
};

export default reducer;
