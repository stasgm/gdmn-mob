import { DeviceState, IEntity, IExternalSystemProps, INamedEntity, UserRole } from './common';
import { IHeadMessage, IMessage } from './messages';

// Типы для хранения данных в бд
export interface IDBUser extends INamedEntity, IExternalSystemProps {
  password: string;
  creatorId: string;
  role: UserRole;
  company: string | null; // по умолчанию null
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
}

export interface IDBCompany extends INamedEntity, IExternalSystemProps {
  adminId: string;
  city?: string;
}

export interface IDBDevice extends INamedEntity {
  uid: string;
  state: DeviceState;
  companyId: string;
}

export interface IDBDeviceBinding extends IEntity {
  userId: string;
  deviceId: string;
  state: DeviceState;
}

export interface IDBActivationCode {
  id?: string;
  code: string;
  date: string;
  deviceId: string;
}

// Messages
export interface IDBHeadMessage extends Omit<IHeadMessage, 'company' | 'producer' | 'consumer'> {
  // appSystem: string;
  companyId: string;
  producerId: string;
  consumerId: string;
  // dateTime: string;
}

export interface IDBMessage<T = any> extends Omit<IMessage<T>, 'head'> {
  head: IDBHeadMessage;
}

// Типы для передачи и хранения данных на клиенте
export interface IUser extends INamedEntity, IExternalSystemProps {
  role: UserRole;
  firstName?: string;
  lastName?: string;
  surName?: string;
  email?: string;
  phoneNumber?: string;
  creator?: INamedEntity;
  company?: INamedEntity;
}

// export type NewUser = Pick<IUser, 'name' | 'externalId'>;
export type NewUser = Omit<IUser, 'id'> & { password: string };

export type IUserCredentials = Pick<IUser, 'name'> & { password: string };

export interface ICompany extends Omit<IDBCompany, 'adminId'> {
  admin: INamedEntity;
}

export type NewCompany = Pick<ICompany, 'admin' | 'externalId' | 'name' | 'city'>;

export interface IDevice extends Omit<IDBDevice, 'companyId'> {
  company: INamedEntity;
}

export type NewDevice = Pick<IDevice, 'name' | 'company'>;

export interface IDeviceBinding extends Omit<IDBDeviceBinding, 'userId' | 'deviceId'> {
  user: INamedEntity;
  device: INamedEntity;
}

export type NewDeviceBinding = Pick<IDeviceBinding, 'user' | 'device' | 'state'>;

export interface IActivationCode extends Omit<IDBActivationCode, 'deviceId'> {
  device: INamedEntity;
}

export type NewActivationCode = Pick<IActivationCode, 'code'>;
