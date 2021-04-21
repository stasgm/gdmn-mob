import { IApiConfig } from '@lib/client-types';
import { IDevice } from '@lib/types';

import companies from './companies';
import users from './users';

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
  user: users[0],
  id: '111',
};

export const company = companies[0];

export const company2 = companies[1];

export const user = users[0];
export const user2 = users[1];
