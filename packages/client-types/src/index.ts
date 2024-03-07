export interface IApiConfig {
  protocol: string;
  server?: string;
  port: number;
  timeout: number;
  version?: string;
  apiPath: string;
  deviceId?: string;
  debug?: {
    isMock?: boolean;
    mockDelay?: number;
    mockDeviceId?: string;
  };
}

export interface IScannedObject {
  state: IScannedObjectState;
  message?: string;
}

const f = 0;

export type IScannedObjectState = 'init' | 'found' | 'error';
