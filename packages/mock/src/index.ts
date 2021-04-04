import { ICompany, IDevice, IUser } from '@lib/types';
import { IApiConfig } from '@lib/client-types';

export const systemName = 'Inventory';

export const config: IApiConfig = {
  port: 3649,
  protocol: 'http://',
  server: '192.168.100.10',
  apiPath: 'api',
  timeout: 5000,
};

export const device: IDevice = {
  name: 'iPhone',
  state: 'ACTIVE',
  uid: 'ecc6ff20-899c-11eb-b406-85744eedb503',
  userId: '1',
  id: '111',
};

export const company: ICompany = {
  id: '1234',
  admin: '1',
  title: 'ОДО Золотые Программы',
};

export const company2: ICompany = {
  id: '1232',
  admin: '1',
  title: 'ОДО Амперсант',
};

export const user: IUser = {
  id: '1',
  creatorId: '1',
  password: '1',
  role: 'Admin',
  userName: 'Шляхтич Станислав',
  firstName: 'Станислав',
  lastName: 'Шляхтич ',
  companies: ['1234', '1235'],
};
