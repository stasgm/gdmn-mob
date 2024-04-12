import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';

const init = createAction('ERP_LOG/INIT')();
const clearError = createAction('ERP_LOG/CLEAR_ERROR')();
const setError = createAction('ERP_LOG/SET_ERROR')<string>();

const fetchErpLogAsync = createAsyncAction(
  'COMPANY/FETCH_ERPLOG',
  'COMPANY/FETCH_ERPLOG_SUCCESS',
  'COMPANY/FETCH_ERPLOG_FAILURE',
)<string | undefined, string, string>();

export const erpLogActions = {
  fetchErpLogAsync,
  clearError,
  init,
  setError,
};

export type ErpLogActionType = ActionType<typeof erpLogActions>;
