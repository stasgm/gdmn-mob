import { ActionType } from 'typesafe-actions';

import { ThunkDispatch } from 'redux-thunk';

import { useDispatch } from 'react-redux';

import { AppThunk } from '../types';

import { GeoState, ILocation } from './types';

import { actions, GeoActionType } from './actions';

export type GeoDispatch = ThunkDispatch<GeoState, any, GeoActionType>;

export const useGeoThunkDispatch = () => useDispatch<GeoDispatch>();

export const removeMany = (
  locations: ILocation[],
): AppThunk<
  Promise<ActionType<typeof actions.removeManyAsync>>,
  GeoActionType,
  ActionType<typeof actions.removeManyAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.removeManyAsync.request(''));

    try {
      return dispatch(actions.removeManyAsync.success(locations));
    } catch {
      return dispatch(actions.removeManyAsync.failure('something wrong'));
    }
  };
};

export default { removeMany, useGeoThunkDispatch };
