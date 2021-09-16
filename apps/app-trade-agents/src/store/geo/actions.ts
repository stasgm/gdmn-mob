import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

import { ILocation } from './types';

const init = createAction('GEOLOCATION/INIT')();
const addOne = createAction('GEOLOCATION/ADD_ONE')<Omit<ILocation, 'id'>>();
const addCurrent = createAction('GEOLOCATION/ADD_CURRENT')<Omit<ILocation, 'id' | 'name' | 'number'>>();
const setCurrentPoint = createAction('GEOLOCATION/SET_CURRENT')<ILocation | undefined>();
const addMany = createAction('GEOLOCATION/ADD_MANY')<ILocation[]>();
const deleteOne = createAction('GEOLOCATION/DELETE_ONE')<string>();
const deleteCurrent = createAction('GEOLOCATION/DELETE_CURRENT')();
const deleteAll = createAction('GEOLOCATION/DELETE_ALL')();
const removeMany = createAction('GEOLOCATION/REMOVE_MANY')<ILocation, 'id'>();
// const removeMany = createAsyncAction(
//   'GEOLOCATION/REMOVE_MANY',
//   'GEOLOCATION/REMOVE_MANY_SUCCESS',
//   'GEOLOCATION/REMOVE_MANY_FAILURE',
// )<string | undefined, string[], string>();

export const geoActions = {
  init,
  addOne,
  addMany,
  addCurrent,
  deleteOne,
  deleteCurrent,
  deleteAll,
  setCurrentPoint,
  removeMany,
};

export type GeoActionType = ActionType<typeof geoActions>;
