import { IDevice, IUser } from '@lib/types';

export interface IAuthQueryResponse {
  type: 'SIGNUP' | 'LOGIN' | 'LOGOUT' | 'GET_CURRENT_USER' | 'USER_NOT_AUTHENTICATED' | 'GET_CODE' | 'VERIFY_CODE';
}

export interface ISignUpResponse extends IAuthQueryResponse {
  type: 'SIGNUP';
  //user: IUser;
}

export interface ILoginResponse extends IAuthQueryResponse {
  type: 'LOGIN';
  user: IUser;
}

export interface ILogOutResponse extends IAuthQueryResponse {
  type: 'LOGOUT';
  userId: string;
}

export interface IUserResponse extends IAuthQueryResponse {
  type: 'GET_CURRENT_USER';
  user: IUser;
}

export interface IUserNotAuthResponse extends IAuthQueryResponse {
  type: 'USER_NOT_AUTHENTICATED';
}

export interface ICreateCodeResponse extends IAuthQueryResponse {
  type: 'GET_CODE';
  code: string;
}

export interface IVerifyCodeResponse extends IAuthQueryResponse {
  type: 'VERIFY_CODE';
  device: IDevice;
}

export type QueryResponse =
  | ILoginResponse
  | IUserResponse
  | ISignUpResponse
  | ILogOutResponse
  | ICreateCodeResponse
  | IVerifyCodeResponse
  | IUserNotAuthResponse;
