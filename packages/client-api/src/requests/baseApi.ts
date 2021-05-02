import { AxiosInstance } from 'axios';

export abstract class BaseApi {
  protected deviceId: string;
  protected readonly api: AxiosInstance;

  constructor(api: AxiosInstance, deviceId: string) {
    this.api = api;
    this.deviceId = deviceId;
  }
}
