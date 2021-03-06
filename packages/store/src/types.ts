import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { AuthActionType } from './auth/actions';
import { DocumentActionType } from './documents/actions';
import { MsgActionType } from './messages/actions';
import { ReferenceActionType } from './references/actions';

export type TActions = AuthActionType | MsgActionType | ReferenceActionType | DocumentActionType;

export type AppThunk<ReturnType = void, S = void, A extends AnyAction = AnyAction> = ThunkAction<
  ReturnType,
  S,
  unknown,
  A
>;
