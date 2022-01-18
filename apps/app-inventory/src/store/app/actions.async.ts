import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { ActionType } from 'typesafe-actions';

import { AppThunk } from '../types';

import { actions, AppInventoryActionType } from './actions';
import { AppInventoryState, IMDGoodRemain, IModelData } from './types';

export type appInventoryDispatch = ThunkDispatch<AppInventoryState, any, AppInventoryActionType>;

export const useAppInventoryThunkDispatch = () => useDispatch<appInventoryDispatch>();

export const setModel = (
  model: IModelData<IMDGoodRemain>,
): AppThunk<
  Promise<ActionType<typeof actions.setModelAsync>>,
  AppInventoryState,
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
