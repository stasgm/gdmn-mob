import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { AuthActionType } from './auth/actions';
import { DocumentActionType } from './documents/actions';
import { MsgActionType } from './messages/actions';
import { ReferenceActionType } from './references/actions';
import { SettingsActionType } from './settings/actions';
import { IFormParam } from './app/types';

export type TActions = AuthActionType | MsgActionType | ReferenceActionType | DocumentActionType | SettingsActionType;

export type AppThunk<ReturnType = void, S = void, A extends AnyAction = AnyAction> = ThunkAction<
  ReturnType,
  S,
  unknown,
  A
>;

export { IFormParam };
