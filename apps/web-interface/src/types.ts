export interface IUser {
  id?: string;
  userName: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  companies?: string[];
  isAdmin?: boolean;
  creatorId?: string;
};
export interface IUserCompany {
  companyId: string;
  companyName: string;
  userRole?: 'Admin';
};

export interface IItem {
  key: string;
  name: string;
}

export enum IDeviceState {
  'notActivated' = 'notActivated',
  'activated' = 'activated',
  'awaitingActivation' = 'awaitingActivation',
  'blocked' = 'blocked'
 }

export interface IDevice {
  uid: string;
  title: string;
  state?: string;
 }
