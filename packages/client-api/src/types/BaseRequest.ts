import { BaseApi } from './BaseApi';

export abstract class BaseRequest {
  protected readonly api: BaseApi;

  constructor(api: BaseApi) {
    this.api = api;
  }
}
