import { IActivationCode } from '@lib/types';
import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('ACTIVATION_CODES/INIT')();
const clearError = createAction('ACTIVATION_CODES/CLEAR_ERROR')();

const fetchCodesAsync = createAsyncAction(
  'ACTIVATION_CODES/FETCH_CODES',
  'ACTIVATION_CODES/FETCH_CODES_SUCCESS',
  'ACTIVATION_CODES/FETCH_CODES_FAILURE',
)<string | undefined, IActivationCode[], string>();

const fetchCodeAsync = createAsyncAction(
  'ACTIVATION_CODE/GET_CODE',
  'ACTIVATION_CODE/GET_CODE_SUCCESS',
  'ACTIVATION_CODE/GET_CODE_FAILURE',
)<string | undefined, IActivationCode, string>();

const createCodeAsync = createAsyncAction(
  'ACTIVATION_CODE/CREATE_CODE',
  'ACTIVATION_CODE/CREATE_CODE_SUCCESS',
  'ACTIVATION_CODE/CREATE_CODE_FAILURE',
)<string | undefined, IActivationCode, string>();

export const activationCodeActions = {
  fetchCodesAsync,
  fetchCodeAsync,
  createCodeAsync,
  clearError,
  init,
};

export type ActivationCodeActionType = ActionType<typeof activationCodeActions>;
