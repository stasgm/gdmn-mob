import { IBaseUrl, IDevice, IUser } from '@lib/types';

export const config: IBaseUrl = {
  port: 3649,
  protocol: 'http://',
  server: '192.168.100.10',
  apiPath: 'api',
  timeout: 5000,
};

export const device: IDevice = {
  name: 'iPhone',
  state: 'ACTIVE',
  uid: '111',
  userId: '1',
  id: '111',
};

export const user: IUser = {
  id: '1',
  creatorId: '1',
  password: '1',
  role: 'Admin',
  userName: 'Шляхтич Станислав',
  firstName: 'Станислав',
  lastName: 'Шляхтич ',
  companies: ['ОДО Золотые Программы'],
};
