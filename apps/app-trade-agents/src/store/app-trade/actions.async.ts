import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { ActionType } from 'typesafe-actions';

import { AppThunk } from '../types';

import { actions, AppTradeActionType } from './actions';
import { AppTradeState, IModel } from './types';

export type appTradeDispatch = ThunkDispatch<AppTradeState, any, AppTradeActionType>;

export const useAppTradeThunkDispatch = () => useDispatch<appTradeDispatch>();

export const setModel = (
  model: IModel,
): AppThunk<
  Promise<ActionType<typeof actions.setModelAsync>>,
  AppTradeActionType,
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
