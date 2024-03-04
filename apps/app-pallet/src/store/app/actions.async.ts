import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import { AppInventoryActionType } from './actions';
import { AppInventoryState } from './types';

export type appInventoryDispatch = ThunkDispatch<AppInventoryState, any, AppInventoryActionType>;

export const useAppInventoryThunkDispatch = () => useDispatch<appInventoryDispatch>();
