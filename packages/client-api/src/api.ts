import axios, { AxiosInstance } from 'axios';

import { config } from '@lib/client-config';
import { IApiConfig } from '@lib/client-types';

import { error } from './types';

import Auth from './requests/auth';
import { BaseApi } from './types/BaseApi';
import Company from './requests/company';
import Device from './requests/device';
import DeviceBinding from './requests/deviceBinding';
import Message from './requests/message';
import User from './requests/user';

class Api extends BaseApi {
  protected _config: IApiConfig;
  protected _deviceId: string | undefined;

  protected readonly _axios: AxiosInstance;
  // Классы запросов
  public auth: Auth;
  public company: Company;
  public device: Device;
  public deviceBinding: DeviceBinding;
  public message: Message;
  public user: User;

  constructor(config: IApiConfig) {
    super();
    this._config = config;
    this._deviceId = undefined; // TODO убрать web  || 'WEB'

    this._axios = axios.create({
      baseURL: `${this._config.protocol}${this._config.server}:${this._config.port}/${this._config.apiPath}`,
      url: this._config.apiPath,
      timeout: config.timeout,
      withCredentials: true,
      headers: { 'Access-Control-Allow-Origin': 'http://192.168.0.61:8080' },
    });

    this.auth = new Auth(this);
    this.company = new Company(this);
    this.device = new Device(this);
    this.deviceBinding = new DeviceBinding(this);
    this.message = new Message(this);
    this.user = new User(this);

    this._axios.defaults.params = {};

    this._axios.defaults.withCredentials = true;

    this._axios.interceptors.request.use(
      (request) => {
        console.log('interceptors deviceId', this._deviceId);
        if (this._deviceId) {
          // Добавляем device_ID
          request.params.deviceId = this._deviceId;
          console.log('request.params.deviceId', request.params.deviceId);
        }

        console.info('✉️ request', request);
        return request;
      },
      (error) => {
        console.info('✉️ request error', error);

        return {
          type: 'ERROR',
          message: error,
        } as error.INetworkError;
      },
    );

    this._axios.interceptors.response.use(
      (response) => {
        console.info('✉️ response', response);
        return response;
      },
      (error) => {
        console.info('✉️ response error', error);
        throw error;
      },
    );
  }

  set config(config: IApiConfig) {
    this._config = config;
  }

  get config() {
    this._axios.defaults = { ...this._axios.defaults, ...this._config };
    return this._config;
  }

  set deviceId(deviceId: string | undefined) {
    this._deviceId = deviceId;
  }

  get deviceId() {
    return this._deviceId;
  }

  get axios() {
    return this._axios;
  }

  /*   getUrl = () => {
      return `${this._config.protocol}${this._config.server}:${this._config.port}/${this._config.apiPath}`;
    }; */
}

const {
  debug: { useMockup },
  server: { name, port, protocol },
  timeout,
  apiPath,
} = config;

export default new Api({
  apiPath,
  timeout,
  protocol,
  port,
  server: name,
  debug: {
    isMock: useMockup,
    mockDelay: 1000,
    // mockDeviceId: deviceId,
  },
});
