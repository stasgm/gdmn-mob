import dev from './dev';
import prod from './prod';

export interface IEnvConfig {
  server: {
    protocol: string;
    name: string;
    port: number;
  };
  version?: string;
  timeout: number;
  apiPath: string;
  debug: {
    useMockup: boolean;
    deviceId?: string;
  };
}

const getConfig = () => {
  let config: IEnvConfig;

  console.log('process.env.DEV_ENV', process.env.NODE_ENV);
  console.log('process.env.MOCK', process.env.MOCK);

  console.log('config', process.env.NODE_ENV, dev);

  switch (process.env.NODE_ENV) {
    case 'production':
      config = prod;
      break;
    case 'development':
      config = dev;
      break;

    default:
      config = dev;
      break;
  }

  const configWithDebug = {
    ...config,
    debug: {
      useMockup: process.env.MOCK ? process.env.MOCK === 'true' : config.debug.useMockup,
      //deviceId: (process.env.DEVICE_ID || config.debug.deviceId || '').toUpperCase(),
    },
  };

  return configWithDebug;
};

export default getConfig();
