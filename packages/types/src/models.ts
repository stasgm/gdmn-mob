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

export type DeviceState = 'NEW' | 'NON-ACTIVATED' | 'ACTIVE' | 'BLOCKED';

export type UserRole = 'Admin' | 'User';

// Типы для хранения данных в бд
export interface IDBUser extends INamedEntity, IExternalSystemProps {
  password: string;
  creatorId: string;
  role: UserRole;
  companies: string[]; // по умолчанию пустой массив
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface IDBCompany extends INamedEntity, IExternalSystemProps {
  adminId: string;
}

export interface IDBDevice extends INamedEntity {
  id: string;
  name: string;
  userId: string;
  uid: string;
  state: DeviceState;
}

export interface IDBActivationCode {
  id?: string;
  code: string;
  date: string;
  deviceId: string;
}

export interface IDBMessage<T = any> {
  id: string;
  head: {
    appSystem: string;
    companyId: string;
    producerId: string;
    consumerId: string;
    dateTime: string;
  };
  body: {
    type: string;
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
export type NewUser = Omit<IUser, 'role' | 'id'> & { password: string };

export type IUserCredentials = Pick<IUser, 'name'> & { password: string };

export interface ICompany extends Omit<IDBCompany, 'adminId'> {
  admin: INamedEntity;
}

export type NewCompany = Pick<IDBCompany, 'name' | 'externalId' | 'adminId'>;

export interface IMessageInfo {
  uid: string;
  date: Date;
}

export interface IDevice extends Omit<IDBDevice, 'userId'> {
  user: INamedEntity;
}

export type NewDevice = Pick<IDBDevice, 'name' | 'userId'>;

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

export interface IMessage<T = any> {
  id: string;
  head: IHeadMessage;
  body: {
    type: string;
    payload: T;
  };
}

export type TNewMessage<T = any> = {
  head: Omit<IHeadMessage, 'producer' | 'dateTime'>;
  body: {
    type: string;
    payload: T;
  };
};

export interface IDataMessage<T = any> {
  id: string;
  name: string;
  type: string;
  data: T;
}
