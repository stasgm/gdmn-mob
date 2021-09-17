import { DeviceState, IEntity, IExternalSystemProps, INamedEntity, UserRole } from './common';
import { IHeadMessage, IMessage } from './messages';

export interface IUserSettings {
  visible: boolean;
  [fieldName: string]: unknown;
}

// Типы для передачи и хранения данных на клиенте
export interface IUser extends INamedEntity, IExternalSystemProps {
  alias?: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  surName?: string;
  email?: string;
  phoneNumber?: string;
  creator?: INamedEntity;
  company?: INamedEntity;
  password?: string;
  settings?: IUserSettings[];
}

export type NewUser = Omit<IUser, 'id'> & { password: string };

export type IUserCredentials = Pick<IUser, 'name'> & { password: string };

export interface ICompany extends INamedEntity, IExternalSystemProps {
  city?: string;
  admin: INamedEntity;
}

export type NewCompany = Pick<ICompany, 'admin' | 'externalId' | 'name' | 'city'>;

export interface IDevice extends INamedEntity {
  uid: string;
  state: DeviceState;
  company: INamedEntity;
}

export type NewDevice = Pick<IDevice, 'name' | 'company' | 'state'>;

export interface IDeviceBinding extends IEntity {
  state: DeviceState;
  user: INamedEntity;
  device: INamedEntity;
}

export type NewDeviceBinding = Pick<IDeviceBinding, 'user' | 'device' | 'state'>;

export interface IActivationCode extends IEntity {
  code: string;
  date: string;
  device: INamedEntity;
}

export type NewActivationCode = Pick<IActivationCode, 'code'>;

// Типы для хранения данных в бд
export interface IDBUser extends Omit<IUser, 'creator' | 'company'> {
  password: string;
  creatorId: string;
  company: string | null; // по умолчанию null
}

export interface IDBCompany extends Omit<ICompany, 'admin'> {
  adminId: string;
}

export interface IDBDevice extends Omit<IDevice, 'company'> {
  companyId: string;
}

export interface IDBDeviceBinding extends Omit<IDeviceBinding, 'user' | 'device'> {
  userId: string;
  deviceId: string;
}

export interface IDBActivationCode extends Omit<IActivationCode, 'device'> {
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
