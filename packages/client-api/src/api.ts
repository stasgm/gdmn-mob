import axios, { AxiosInstance } from 'axios';

import { IApiConfig } from '@lib/client-types';
import { IDevice, IResponse } from '@lib/types';

import { device, error } from './types';

// import { config as defaultConfig } from '@lib/client-config';

// const Axios = axios.create();

// add session token to all requests

/* const DEBUG = process.env.NODE_ENV === 'development';

const requestInterceptor = (config) => {
  if (DEBUG) {
    console.info('✉️ ', config);
  }

  return {
    ...config,
    headers: {
      ...config.headers,
      'x-auth-token': localStorage.getItem('token'),
    },
  };
}; */

class Api {
  // private config: IApiConfig;
  // private deviceId: string;
  private readonly axios: AxiosInstance;

  constructor(private config: IApiConfig, private deviceId: string = '') {
    this.config = config;
    this.deviceId = deviceId;
    // const config = defaultConfig;
    this.axios = axios.create({
      baseURL: `${this.config.protocol}${this.config.server}:${this.config.port}/${this.config.apiPath}`,
      /* headers: {
        'X-Requested-With': 'XMLHttpRequest',
      }, */
    });

    this.axios.interceptors.request.use(
      (request) => {
        // Добавляем  device_ID
        request.params['deviceId'] = this.deviceId;
        console.info('✉️ request', request);
        return request;
      },
      (error) => {
        console.info('✉️ request error', error);

        return {
          type: 'ERROR',
          message: error,
        } as error.INetworkError;
        // throw error;
      },
    );

    this.axios.interceptors.response.use(
      (response) => {
        console.info('✉️ request', response);
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

  getDevice = async (deviceId?: string, userId?: string) => {
    try {
      const paramQuery = userId ? `?userId=${userId}` : '';

      const res = await this.axios.get<IResponse<IDevice>>(`/devices/${deviceId || this.deviceId}${paramQuery}`);

      const resData = res?.data;

      if (resData?.result) {
        return {
          type: 'GET_DEVICE',
          device: resData.data,
        } as device.IGetDeviceResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err?.response?.data?.error || 'ошибка подключения',
      } as error.INetworkError;
    }
  };
}

export default Api;
