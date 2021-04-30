import { IMessage } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('REF/INIT')();

const fetchMessAsync = createAsyncAction('MES/FETCH', 'MES/FETCH_SUCCCES', 'MES/FETCH_FAILURE')<
  string | undefined,
  IMessage[],
  string
>();

export const mesActions = {
  fetchMessAsync,
  init,
};

export type MesActionType = ActionType<typeof mesActions>;
