import { IApiConfig } from '@lib/client-types';
import { AxiosInstance } from 'axios';

export abstract class BaseApi {
  protected abstract _config: IApiConfig;
  protected abstract _deviceId: string | undefined;
  protected abstract _activationCodeId: string | undefined;

  abstract readonly axios: AxiosInstance;

  abstract get deviceId(): string | undefined;
  abstract get activationCodeId(): string | undefined;
  abstract get config(): IApiConfig;
}
