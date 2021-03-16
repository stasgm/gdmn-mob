import { IUser } from '@lib/common-types';

export interface IUserQueryResponse {
  type:
    | 'GET_USERS'
    | 'GET_USER'
    | 'ADD_USER'
    | 'USER_NOT_AUTHENTICATED'
    | 'UPDATE_USER'
    | 'REMOVE_USER';
}

export interface IUserNotAuthResponse extends IUserQueryResponse {
  type: 'USER_NOT_AUTHENTICATED';
}

export interface IGetUsersResponse extends IUserQueryResponse {
  type: 'GET_USERS';
  users: IUser[];
}

export interface IGetUserResponse extends IUserQueryResponse {
  type: 'GET_USER';
  user: IUser;
}

export interface ICreateUserResponse extends IUserQueryResponse {
  type: 'ADD_USER';
  user: IUser;
}

export interface IUpdateUserResponse extends IUserQueryResponse {
  type: 'UPDATE_USER';
  userId: string;
}

export interface IRemoveUserResponse extends IUserQueryResponse {
  type: 'REMOVE_USER';
}

export type UserQueryResponse =
  | IGetUsersResponse
  | IGetUserResponse
  | ICreateUserResponse
  | IUpdateUserResponse
  | IRemoveUserResponse
  | IUserNotAuthResponse;
