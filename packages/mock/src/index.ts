import { IApiConfig } from '@lib/client-types';

// import * as users from './users';
// import * as devices from './devices';
// import * as companies from './companies';

export const systemName = 'Inventory';

export const config: IApiConfig = {
  port: 3649,
  protocol: 'http://',
  server: '192.168.100.10',
  apiPath: 'api',
  timeout: 5000,
};

// export default { ...users, ...devices, ...companies };
