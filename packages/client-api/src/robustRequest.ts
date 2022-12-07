// import { URLSearchParams } from 'url';

import { config } from '@lib/client-config';
import { IResponse } from '@lib/types';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// import api from './api';

/** Функция, вызывается при неверной авторизации */
export type AuthLogOut = () => Promise<any>;

export type CustomRequest = <T>(params: IRequestParams) => Promise<IResponse<T> | undefined>;

export type CustomRequestProps = <T>(dispatch: any, actions: any) => CustomRequest;

/** Валидатор проверяет полученные данные на корректность. В случае ошибки генерирует исключение. */
type Validator = (data: Record<string, unknown>) => void;

/** Десериализатор, если есть, может одновременно являться  и валидатором. */
type Deserializer = <T>(data: Record<string, unknown>) => T;

interface IURLParams {
  [paramName: string]: string | number;
}

export interface IRequestParams {
  api: AxiosInstance;
  /** method HTTP. По умолчанию подставляется GET. */
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Базовый УРЛ. Если задан, то итоговый УРЛ получается слиянием базового и УРЛ. Может содержать маску.*/
  baseUrl?: string;
  /** Адрес. Может содержать маску.*/
  url: string;
  /** Параметры, если url и/или baseUrl используют маску. Кодируются в строку через URL Encoder. */
  params?: IURLParams;
  /** Данные для передачи методом POST. */
  data?: Record<string, unknown>;
  /** Функция проверки полученных данных. Проверяются только результаты запроса со статусом 2ХХ */
  validator?: Validator;
  /** Функция преобразования полученных данных в нужный тип объекта */
  deserializer?: Deserializer;
  /** Тайм аут в секундах */
  timeout?: number;
}

export type RequestResult = IServerResponseResult | IServerUnreacheableResult | IErrorResult;

// export interface IResponse {
//   /** HTTP response status */
//   status: number;
//   data?: any;
// }

interface IServerResponseResult {
  /** 2xx, 4xx, 5xx */
  result: 'OK' | 'CLIENT_ERROR' | 'SERVER_ERROR';
  response: {
    /** HTTP response status */
    status: number;
    data?: any;
  };
}

export interface IServerUnreacheableResult {
  result: 'NO_CONNECTION' | 'TIMEOUT';
}

/** Возвращается, когда произошло исключение при проверки типа, десериализации или вообще в процессе работы */
interface IErrorResult {
  result: 'INVALID_DATA' | 'ERROR';
  message?: string;
}

export type RobustRequest = (params: IRequestParams) => Promise<RequestResult>;

export const robustRequest: RobustRequest = async ({
  api,
  method,
  baseUrl,
  url,
  params,
  data,
  validator,
  deserializer,
  timeout = config.timeout,
}) => {
  let urlParams: IURLParams | undefined;

  if (params) {
    urlParams = Object.entries(params).reduce((prev: IURLParams, [field, value]) => {
      prev[field] = `${value}`;
      return prev;
    }, {});
  }

  const controller = new AbortController();

  const rTimeout = setTimeout(() => {
    controller.abort();
    console.log('Aborted');
  }, timeout);

  try {
    const config = { params: urlParams, signal: controller.signal };

    let res: AxiosResponse<IResponse<any>, any>;
    switch (method) {
      case 'GET': {
        res = await api.get(url, config);
        break;
      }
      case 'POST': {
        res = await api.post(url, data, config);
        break;
      }
      case 'PUT': {
        res = await api.put(url, data, config);
        break;
      }
      case 'DELETE': {
        res = await api.delete(url, config);
        break;
      }
      default:
        return {
          result: 'ERROR',
          message: 'Неизвестный тип запроса',
        };
    }
    clearTimeout(rTimeout);

    let objData = res.data;

    //Проверка данных validator
    if (res.data?.data) {
      if (validator) {
        validator(res.data.data);
      }

      //Десериализация данных deserializer
      objData = { ...res.data, data: deserializer ? deserializer(res.data.data) : res.data.data };
    } else if (validator) {
      return {
        result: 'INVALID_DATA',
        message: 'Пустой ответ сервера',
      };
    }

    return {
      result: 'OK',
      response: {
        status: res.status,
        data: objData,
      },
    } as IServerResponseResult;
  } catch (err) {
    console.log('rr catch', JSON.stringify(err));
    clearTimeout(rTimeout);

    if (controller.signal.aborted) {
      return {
        result: 'TIMEOUT',
      };
    }

    if (err instanceof AxiosError) {
      if (err.response?.status) {
        return {
          result: 'SERVER_ERROR',
          response: {
            status: err.response?.status || 500,
            data: err.response?.data,
          },
        };
      } else {
        return {
          result: 'NO_CONNECTION',
        };
      }
    }

    return {
      result: 'ERROR',
    };
  }
};
