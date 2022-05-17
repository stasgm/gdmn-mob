import { INamedEntity } from '@lib/types';

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

export interface IQuerySellBill {
  ID: string;
  NUMBER: string;
  CONTRACT?: string;
  CONTRACTKEY?: string;
  DEPARTNAME?: string;
  DEPARTKEY?: string;
  DOCUMENTDATE: string;
  QUANTITY: number;
  PRICE: number;
}

export interface ISellBill {
  id: string;
  number: string;
  contract?: INamedEntity;
  depart?: INamedEntity;
  documentdate: string;
  quantity: number;
  price: number;
}
