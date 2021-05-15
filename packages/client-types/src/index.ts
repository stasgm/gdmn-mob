export interface IApiConfig {
  protocol: string;
  server: string;
  port: number;
  timeout: number;
  apiPath: string;
  debug?: {
    isMock?: boolean;
    mockDelay?: number;
    mockDeviceId?: string;
  };
}
