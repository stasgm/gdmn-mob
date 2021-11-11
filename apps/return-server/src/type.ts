export type IParams = (string | Date | number)[];

export type IRecordObject = {
  [name: string]: string;
};
export interface IResponse<T = undefined> {
  result: boolean;
  error?: string;
  data?: T;
}

export interface IUser {
  name: string;
  password: string;
}

export interface IUserRequest extends Request {
  user: IUser;
}

export type AuthToken = {
  [name: string]: IUser;
};
