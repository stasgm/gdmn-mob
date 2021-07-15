import { IActivationCode } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('ACTIVATION_CODES/INIT')();
const clearError = createAction('ACTIVATION_CODES/CLEAR_ERROR')();

const fetchActivationCodesAsync = createAsyncAction(
  'ACTIVATION_CODES/FETCH_ACTIVATION_CODES',
  'ACTIVATION_CODES/FETCH_ACTIVATION_CODES',
  'ACTIVATION_CODES/FETCH_ACTIVATION_CODES',
)<string | undefined, IActivationCode[], string>();

const fetchActivationCodeAsync = createAsyncAction(
  'ACTIVATION_CODE/FETCH_ACTIVATION_CODE',
  'ACTIVATION_CODE/FETCH_ACTIVATION_CODE_SUCCESS',
  'ACTIVATION_CODE/FETCH_ACTIVATION_CODE_FAILURE',
)<string | undefined, IActivationCode, string>();

export const activationCodeActions = {
  fetchActivationCodesAsync,
  fetchActivationCodeAsync,
  clearError,
  init,
};

export type ActivationCodeActionType = ActionType<typeof activationCodeActions>;
