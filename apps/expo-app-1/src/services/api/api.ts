import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { services } from '../../constants';

// import storage from '../../utils/storage';
import { IApiErrorResponse, IApiResponse } from './types';

const baseAxiosConfig = {
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const axiosConfigV1 = Object.assign(
  {
    baseURL: services.baseUrl,
  },
  baseAxiosConfig,
);

function authRequestInterceptor(config: AxiosRequestConfig = {}) {
  axiosLogger('request', JSON.stringify(config));
  // const token = storage.getToken();
  // if (config.headers) {
  //   if (token) {
  //     config.headers.Authorization = `Bearer ${token}`;
  //   }
  //   config.headers.Accept = 'application/json';
  // }
  return config;
}

const handleError = (error: any): IApiErrorResponse => {
  if (error.message === 'Network Error') {
    return { success: false, data: { error: 'Network Error' } };
  }

  console.error('handleError', JSON.stringify(error));
  const { statusCode } = error.response?.data;
  if (statusCode === 401) {
    return { success: false, data: { error: 'No permissions' } };
  }

  if (statusCode === 400) {
    throw { success: false, data: error.response?.data } as IApiErrorResponse;
    // return { success: false, data: error.response?.data } as IApiErrorResponse;
  }

  // if (statusCode === 500) {
  //   return { success: false, data: { error: error.message } } as IApiErrorResponse;
  // }

  throw error;
};

const handleResponse = <T>(res: T): IApiResponse<T> => {
  return {
    success: true,
    data: res,
  };
};

const axiosLogger = (type: string, data: any) => {
  console.log(`[${type}]: ${JSON.stringify(data)}`);
};

export const apiProvider = <T>(endpoint: string) => {
  const api = axios.create(axiosConfigV1);

  api.interceptors.request.use(authRequestInterceptor, (error) => axiosLogger('response-err', error));
  api.interceptors.response.use(
    (response) => {
      axiosLogger('response', response);
      return response;
    },
    (error) => {
      axiosLogger('response-err', error);
      // const message = error.response?.data?.message || error.message;
      // console.log('error message: ', message)
      return Promise.reject(error);
    },
  );

  const getCommonOptions = () => {
    return {};
  };

  const getAll = async (options = {}): Promise<IApiResponse<T[]> | IApiErrorResponse> => {
    try {
      const res = await api.get<T[]>(`${endpoint}`, { ...options, ...getCommonOptions() });
      return handleResponse<T[]>(res.data);
    } catch (error) {
      return handleError(error as AxiosError);
    }
  };

  const get = async (id: string, options = {}): Promise<IApiResponse<T> | IApiErrorResponse> => {
    try {
      const res = await api.get<T>(`${endpoint}/${id}`, { ...options, ...getCommonOptions() });
      return handleResponse<T>(res.data);
    } catch (error) {
      return handleError(error);
    }
  };

  const post = async (data = {}, options = {}): Promise<IApiResponse<T> | IApiErrorResponse> => {
    try {
      const res = await api.post<T>(`${endpoint}`, data, { ...options, ...getCommonOptions() });
      return handleResponse<T>(res.data);
    } catch (error) {
      return handleError(error as AxiosError);
    }
  };

  const remove = async (id: string, options = {}): Promise<IApiResponse<T> | IApiErrorResponse> => {
    try {
      const res = await api.delete<T>(`${endpoint}/${id}`, { ...options, ...getCommonOptions() });
      return handleResponse<T>(res.data);
    } catch (error) {
      return handleError(error as AxiosError);
    }
  };

  const patch = async (id: string, data = {}, options = {}): Promise<IApiResponse<T> | IApiErrorResponse> => {
    try {
      console.log('item', id, data);
      const res = await api.put<T>(`${endpoint}/${id}`, data, { ...options, ...getCommonOptions() });
      return handleResponse<T>(res.data);
    } catch (error) {
      return handleError(error as AxiosError);
    }
  };

  return { getAll, get, post, remove, patch };
};
