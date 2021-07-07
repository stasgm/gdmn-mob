// Базовые типы
export interface IEntity {
  id: string;
  creationDate?: string;
  editionDate?: string;
}

export interface INamedEntity extends IEntity {
  name: string;
}

export interface IExternalSystemProps {
  externalId?: string;
}

export type DeviceState = 'NON-REGISTERED' | 'NON-ACTIVATED' | 'ACTIVE' | 'BLOCKED';

export type UserRole = 'SuperAdmin' | 'Admin' | 'User';

// Типы для хранения данных в бд
export interface IDBUser extends INamedEntity, IExternalSystemProps {
  password: string;
  creatorId: string;
  role: UserRole;
  companies: string[]; // по умолчанию пустой массив
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

interface IDBHeadMessage {
  appSystem: string;
  companyId: string;
  producerId: string;
  consumerId: string;
  dateTime: string;
}

export interface IDBMessage<T = any> {
  id: string;
  status: TStatusMessage;
  head: IDBHeadMessage;
  body: {
    type: TBodyType;
    payload: T;
  };
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
  companies: INamedEntity[];
}

// export type NewUser = Pick<IUser, 'name' | 'externalId'>;
export type NewUser = Omit<IUser, 'id'> & { password: string };

export type IUserCredentials = Pick<IUser, 'name'> & { password: string };

export interface ICompany extends Omit<IDBCompany, 'adminId'> {
  admin: INamedEntity;
}

export type NewCompany = Pick<ICompany, 'admin' | 'externalId' | 'name' | 'city'>;

export interface IMessageInfo {
  uid: string;
  date: Date;
}

export interface IDevice extends Omit<IDBDevice, 'companyId'> {
  company: INamedEntity;
}

export type NewDevice = Pick<IDevice, 'name' | 'company'>;

export interface IDeviceBinding extends Omit<IDBDeviceBinding, 'userId' | 'deviceId'> {
  user: INamedEntity;
  device: INamedEntity;
}

export type NewDeviceBinding = Pick<IDeviceBinding, 'user' | 'device'>;

export interface IActivationCode extends Omit<IDBActivationCode, 'deviceId'> {
  device: INamedEntity;
}

interface IHeadMessage {
  appSystem: string;
  company: INamedEntity;
  producer: INamedEntity;
  consumer: INamedEntity;
  dateTime: string;
}

export type TStatusMessage = 'recd' | 'procd';
type TBodyType = 'cmd' | 'refs' | 'docs';

export interface IMessage<T = any> {
  id: string;
  status: TStatusMessage;
  head: IHeadMessage;
  body: {
    type: TBodyType;
    payload: T;
  };
}

export type NewMessage<T = any> = {
  head: Omit<IHeadMessage, 'producer' | 'dateTime'>;
  status: TStatusMessage;
  body: {
    type: TBodyType;
    payload: T;
  };
};

export interface IDataMessage<T = any> {
  id: string;
  name: string;
  type: string;
  data: T;
}
