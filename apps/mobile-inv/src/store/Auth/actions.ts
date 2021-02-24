import { createActionPayload, ActionsUnion, createAction } from '../utils';

// eslint-disable-next-line no-shadow
export enum ActionAuthTypes {
  DISCONNECT = 'DISCONNECT',
  LOG_OUT = 'LOG_OUT',
  SET_DEVICE_STATUS = 'SET_DEVICE_STATUS',
  SET_USER_STATUS = 'SET_USER_STATUS',
  SET_COMPANY_ID = 'SET_COMPANY_ID',
  SET_USER_ID = 'SET_USER_ID',
}

export const AuthActions = {
  disconnect: createActionPayload<ActionAuthTypes.DISCONNECT, void>(ActionAuthTypes.DISCONNECT),
  logOut: createAction<ActionAuthTypes.LOG_OUT>(ActionAuthTypes.LOG_OUT),
  setDeviceStatus: createActionPayload<ActionAuthTypes.SET_DEVICE_STATUS, boolean | undefined>(
    ActionAuthTypes.SET_DEVICE_STATUS,
  ),
  setUserStatus: createActionPayload<
    ActionAuthTypes.SET_USER_STATUS,
    { userID: string | undefined | null; userName: string }
  >(ActionAuthTypes.SET_USER_STATUS),
  setCompanyID: createActionPayload<ActionAuthTypes.SET_COMPANY_ID, { companyId: string; companyName: string }>(
    ActionAuthTypes.SET_COMPANY_ID,
  ),
};

export type TAuthActions = ActionsUnion<typeof AuthActions>;
