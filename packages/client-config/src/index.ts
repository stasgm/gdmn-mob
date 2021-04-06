export interface IEnvConfig {
  server: {
    protocol: string;
    name: string;
    port: number;
  };
  timeout: number;
  apiPath: string;
  debug: {
    useMockup: boolean;
  };
}

export const baseConfig: IEnvConfig = {
  server: {
    protocol: 'http://',
    name: '192.168.100.10',
    port: 3649,
  },
  timeout: 10000,
  apiPath: 'api',
  debug: {
    useMockup: false,
  },
};

