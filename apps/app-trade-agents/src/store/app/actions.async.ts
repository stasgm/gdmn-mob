import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { ActionType } from 'typesafe-actions';

import { AppThunk } from '../types';

import { actions, AppTradeActionType } from './actions';
import { AppTradeState, IGoodModel, IModelData } from './types';

export type appTradeDispatch = ThunkDispatch<AppTradeState, any, AppTradeActionType>;

export const useAppTradeThunkDispatch = () => useDispatch<appTradeDispatch>();

export const setGoodModel = (
  goodModel: IModelData<IGoodModel>,
): AppThunk<
  Promise<ActionType<typeof actions.setGoodModelAsync>>,
  AppTradeState,
  ActionType<typeof actions.setGoodModelAsync>
> => {
  return async (dispatch) => {
    dispatch(actions.setGoodModelAsync.request(''));

    try {
      return dispatch(actions.setGoodModelAsync.success(goodModel));
    } catch {
      return dispatch(actions.setGoodModelAsync.failure('Модель товаров не установлена'));
    }
  };
};

export default { setGoodModel, useAppTradeThunkDispatch };
