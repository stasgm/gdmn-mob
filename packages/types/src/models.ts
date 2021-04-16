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

export interface IDBUser extends INamedEntity, IExernalSystemProps {
  password: string;
  creatorId: string;
  role: userRole;
  activationCode?: string;
  companies?: string[];
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface IUser extends Omit<IDBUser, 'creatorId' | 'companies'> {
  creator: INamedEntity;
  companies?: INamedEntity[];
}

export type NewUser = Pick<IDBUser, 'name' | 'externalId'>;

export interface IActivationCode {
  id?: string;
  code: string;
  date: string;
  deviceId: string;
}

export interface IDBCompany extends INamedEntity, IExernalSystemProps {
  adminId: string;
}

export interface ICompany extends Omit<IDBCompany, 'adminId'> {
  admin: INamedEntity;
}

export type NewCompany = Pick<IDBCompany, 'name' | 'externalId'>;

// export type CompanyDto = IDBCompany;

// export type IUser = IUser;

export interface IEntity {
  id: string;
  createDate?: string;
  updateDate?: string;
}

export interface INamedEntity extends IEntity {
  name: string;
}

export interface IExernalSystemProps {
  externalId?: string;
}

export type DeviceState = 'NEW' | 'NON-ACTIVATED' | 'ACTIVE' | 'BLOCKED';

export interface IDevice {
  id?: string;
  name: string;
  userId: string;
  uid?: string;
  state: DeviceState;
}

// export interface IDeviceInfo {
//   id: string;
//   deviceId: string;
//   deviceName: string;
//   userId: string;
//   userName: string;
//   state: DeviceState;
// }

export interface IMessageInfo {
  uid: string;
  date: Date;
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

export interface IDataMessage<T = any> {
  id: string;
  name: string;
  type: string;
  data: T;
}

export interface IUserCredentials {
  userName: string;
  password: string;
}
