import { IApiConfig } from '@lib/client-types';
import { AxiosInstance } from 'axios';

export abstract class BaseApi {
  protected abstract _config: IApiConfig;

  abstract readonly axios: AxiosInstance;

  abstract get config(): IApiConfig;
  abstract set config(config: IApiConfig);
}
