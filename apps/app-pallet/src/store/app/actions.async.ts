import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import { AppPalletActionType } from './actions';
import { AppPalletState } from './types';

export type appPalletDispatch = ThunkDispatch<AppPalletState, any, AppPalletActionType>;

export const useAppPalletThunkDispatch = () => useDispatch<appPalletDispatch>();
