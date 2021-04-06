import { baseConfig, IEnvConfig } from '@lib/client-config';

import dev from './dev';
import devMock from './devMock';
import prod from './prod';

// import 'dotenv/config';

let config = dev;

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

switch (process.env.NODE_ENV) {
  case 'production':
    config = prod;
    break;
  case 'dev':
    config = dev;
    break;

  case 'dev-mock':
    config = devMock;
    break;
  default:
    break;
}

console.log('config', config);

export const DEFAULT_API_CONFIG: IEnvConfig = {
  ...baseConfig,
  ...config,
};

export default DEFAULT_API_CONFIG;
