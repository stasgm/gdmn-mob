import { IApiConfig } from '@lib/client-types';
import { AxiosInstance } from 'axios';

export abstract class BaseApi {
  protected abstract _config: IApiConfig;
  protected abstract _deviceId: string;

  abstract readonly axios: AxiosInstance;

  abstract get deviceId(): string;
}
