import axios, { AxiosInstance } from 'axios';

import { IApiConfig } from '@lib/client-types';

import { error } from './types';

import Auth from './requests/auth';
import Company from './requests/company';
import Device from './requests/device';
import Message from './requests/message';
import User from './requests/user';

class Api {
  private config: IApiConfig;
  private deviceId: string;

  private readonly axios: AxiosInstance;
  // Классы запросов
  public auth: Auth;
  public company: Company;
  public device: Device;
  public message: Message;
  public user: User;

  constructor(config: IApiConfig, deviceId: string) {
    this.config = config;
    this.deviceId = deviceId || 'WEB';

    this.axios = axios.create({
      baseURL: `${this.config.protocol}${this.config.server}:${this.config.port}/${this.config.apiPath}`,
      url: this.config.apiPath,
      timeout: config.timeout,
    });

    this.auth = new Auth(this.axios, this.deviceId);
    this.company = new Company(this.axios, this.deviceId);
    this.device = new Device(this.axios, this.deviceId);
    this.message = new Message(this.axios, this.deviceId);
    this.user = new User(this.axios, this.deviceId);

    this.axios.defaults.params = {};

    this.axios.interceptors.request.use(
      (request) => {
        // Добавляем device_ID
        request.params.deviceId = this.deviceId;
        // console.info('✉️ request', request);
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

    this.axios.interceptors.response.use(
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

  setConfig = (config: IApiConfig) => {
    this.config = config;
  };

  setDeviceId = (deviceId: string) => {
    this.deviceId = deviceId;
  };

  getUrl = () => {
    return `${this.config.protocol}${this.config.server}:${this.config.port}/${this.config.apiPath}`;
  };
}

export default Api;
