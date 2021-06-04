import { ActionType, createAction } from 'typesafe-actions';

import { IVisit } from '../docs/types';

const init = createAction('VISIT/INIT')();
const addOne = createAction('VISIT/ADD_ONE')<IVisit>();
const edit = createAction('VISIT/EDIT')<Omit<IVisit, 'dateBegin' | 'beginGeoPoint' | 'takenType' | 'routeLineId'>>();

export const visitActions = {
  init,
  addOne,
  edit,
};

export type VisitActionType = ActionType<typeof visitActions>;
