import { IDBCompany, IUser } from '@lib/types';
export interface IApiConfig {
  protocol: string;
  server: string;
  port: number;
  timeout: number;
  apiPath: string;
}

export interface IDataFetch {
  isLoading: boolean;
  isError: boolean;
  status?: string;
}

export interface IAuthState {
  companyID?: string | null;
  userID?: string | null;
  deviceRegistered?: boolean;
  deviceActive?: boolean;
  deviceId?: string;
  profile?: {
    userName: string;
    companyName: string;
  };
}

export interface ICompany extends Omit<IDBCompany, 'adminId'> {
  admin: Admin;
}

export type Admin = Pick<IUser, 'id' | 'userName'>;
