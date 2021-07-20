export interface IApiConfig {
  protocol: string;
  server: string;
  port: number;
  timeout: number;
  apiPath: string;
  deviceId?: string;
  debug?: {
    isMock?: boolean;
    mockDelay?: number;
    mockDeviceId?: string;
  };
}
