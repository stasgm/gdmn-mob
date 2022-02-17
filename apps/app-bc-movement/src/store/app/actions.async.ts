import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { ActionType } from 'typesafe-actions';

import { AppThunk } from '../types';

import { actions, AppMovementActionType } from './actions';
import { AppMovementState, IMDGoodRemain, IModelData } from './types';

export type appMovementDispatch = ThunkDispatch<AppMovementState, any, AppMovementActionType>;

export const useAppMovementThunkDispatch = () => useDispatch<appMovementDispatch>();

export const setModel = (
  model: IModelData<IMDGoodRemain>,
): AppThunk<
  Promise<ActionType<typeof actions.setModelAsync>>,
  AppMovementState,
  ActionType<typeof actions.setModelAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.setModelAsync.request(''));

    try {
      return dispatch(actions.setModelAsync.success(model));
    } catch {
      return dispatch(actions.setModelAsync.failure('something wrong'));
    }
  };
};

export default { setModel };
