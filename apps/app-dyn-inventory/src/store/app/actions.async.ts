import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { ActionType } from 'typesafe-actions';

import { AppThunk } from '../types';

import { actions, AppActionType as AppActionType } from './actions';
import { AppState, IMDGoodRemain, IModelData } from './types';

export type appDispatch = ThunkDispatch<AppState, any, AppActionType>;

export const useAppThunkDispatch = () => useDispatch<appDispatch>();

export const setModel = (
  model: IModelData<IMDGoodRemain>,
): AppThunk<Promise<ActionType<typeof actions.setModelAsync>>, AppState, ActionType<typeof actions.setModelAsync>> => {
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
