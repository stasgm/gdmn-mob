import { ActionType, createAction } from 'typesafe-actions';

import { ILocation } from './types';

const init = createAction('GEOLOCATION/INIT')();
const addOne = createAction('GEOLOCATION/ADD_ONE')<Omit<ILocation, 'id'>>();
const deleteOne = createAction('GEOLOCATION/DELETE_ONE')<string>();
const deleteAll = createAction('GEOLOCATION/DELETE_ALL')();

export const geoActions = {
  init,
  addOne,
  deleteOne,
  deleteAll,
};

export type GeoActionType = ActionType<typeof geoActions>;
