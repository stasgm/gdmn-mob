import { IApiConfig } from '@lib/client-types';
import { AxiosInstance } from 'axios';

export abstract class BaseApi {
  protected abstract _config: IApiConfig;
  // protected abstract _deviceId: string | undefined;

  abstract readonly axios: AxiosInstance;

  // abstract get deviceId(): string | undefined;
  // abstract set deviceId(deviceId: string | undefined);

  abstract get config(): IApiConfig;
  abstract set config(config: IApiConfig);
}
