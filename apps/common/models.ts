import { IDocument } from './base';

export interface IUserProfile {
  id?: string;
  userName: string;
  companies?: string[];
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  creatorId: string;
}

export type userRole = 'Admin' | 'User';

export interface IUser {
  id?: string;
  externalId?: string;
  userName: string;
  password: string;
  activationCode?: string;
  companies?: string[];
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  creatorId: string;
  role: userRole;
}

export interface IBaseUrl {
  protocol: string;
  server: string;
  port: number;
  timeout: number,
  apiPath: string;
}

export interface IActivationCode {
  id?: string;
  code: string;
  date: string;
  deviceId: string;
}

export interface ICompany {
  id: string;
  externalId?: string;
  title: string;
  admin: string;
}

export type DeviceState  = 'NEW' | 'NON-ACTIVATED' | 'ACTIVE' | 'BLOCKED'

export interface IDevice {
  id?: string;
  name: string;
  userId: string;
  uid: string;
  state: DeviceState;
}

export interface IDeviceInfo {
  id: string;
  deviceId: string;
  deviceName: string;
  userId: string;
  userName: string;
  state: DeviceState;
}

export interface IMessageInfo {
  uid: string;
  date: Date;
}

export interface IDataMessage<T = any> {
  id: string;
  name: string;
  type: string;
  data: T;
}

export interface ICmd {
   name: string;
   params: IDocument[] | string[] | any;
}

export interface IMessage<T = any> {
  id?: string;
  head: {
    id: string;
    appSystem: string;
    companyid: string;
    producer: string;
    consumer: string;
    dateTime: string;
  };
  body: {
    type: string;
    payload: T;
  };
}

export interface IUserCredentials {
  userName: string;
  password: string;
}