import { DeviceState, IEntity, IExternalSystemProps, INamedEntity, UserRole } from './common';

export interface IUserSettings {
  [fieldName: string]: IUserSetting;
}

export interface IUserSetting {
  visible?: boolean;
  data: string | number | INamedEntity;
  description: string;
}

// Типы для передачи и хранения данных на клиенте
export interface IUser extends INamedEntity, IExternalSystemProps {
  alias?: string;
  role: UserRole;
  erpUser?: INamedEntity;
  appSystem?: INamedEntity;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  creator?: INamedEntity;
  company?: INamedEntity;
  settings?: IUserSettings;
  externalId?: string;
  disabled?: boolean;
  accessCode?: string;
}

export type n = Omit<IUser, 'id' | 'name'>;

export type NewUser = Omit<IUser, 'id'> & { password: string; verifyPassword?: string };

export type IUserCredentials = Pick<IUser, 'name' | 'email'> & { password: string; verifyPassword?: string };

export type IUserWithDevice = IUser & { deviceUids?: string[] };

export interface ICompany extends INamedEntity, IExternalSystemProps {
  city?: string;
  admin: INamedEntity;
  appSystems?: INamedEntity[];
}

export type NewCompany = Pick<ICompany, 'admin' | 'externalId' | 'name' | 'city' | 'appSystems'>;

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

export type NewAccessCode = {
  code: string;
};

// Типы для хранения данных в бд
export interface IDBUser extends Omit<IUser, 'creator' | 'company' | 'erpUser' | 'appSystem'> {
  password: string;
  creatorId: string;
  company: string | null; // по умолчанию null
  erpUserId?: string;
  appSystemId?: string;
}

export interface IDBCompany extends Omit<ICompany, 'admin' | 'appSystems'> {
  adminId: string;
  appSystemIds?: string[];
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

export type SessionId = IEntity;

export interface IAppSystem extends INamedEntity {
  description?: string;
}

export type NewAppSystem = Pick<IAppSystem, 'name' | 'description'>;

export type DBAppSystem = IAppSystem;
