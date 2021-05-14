// import { AxiosInstance } from 'axios';
// import Api from '../api';
import { BaseApi } from '../types/types';

export abstract class BaseRequest {
  // protected deviceId: string;
  protected readonly api: BaseApi;

  constructor(api: BaseApi) {
    this.api = api;
    // this.deviceId = deviceId;
  }
}
