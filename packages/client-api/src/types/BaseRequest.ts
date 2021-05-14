import { BaseApi } from './BaseApi';

export abstract class BaseRequest {
  // protected deviceId: string;
  protected readonly api: BaseApi;

  constructor(api: BaseApi) {
    this.api = api;
    // this.deviceId = deviceId;
  }
}
