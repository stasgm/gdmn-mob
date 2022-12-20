import { config } from '@lib/client-config';
import { ErrorResponse, ServerResponse, TResponse } from '@lib/types';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

/** Функция, вызывается при неверной авторизации */
export type AuthLogOut = () => Promise<any>;

export type CustomRequest = <T>(params: IRequestParams) => Promise<TResponse<T>>;

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

// export type RequestResult = IServerResponseResult | IServerUnreacheableResult | IErrorResult;

// export interface IResponse {
//   /** HTTP response status */
//   status: number;
//   data?: any;
// }

// interface IServerResponseResult {
//   /** 2xx, 4xx, 5xx */
//   result: 'OK' | 'CLIENT_ERROR' | 'SERVER_ERROR';
//   response: {
//     /** HTTP response status */
//     status: number;
//     data?: any;
//   };
// }

// export interface IServerUnreacheableResult {
//   result: 'NO_CONNECTION' | 'TIMEOUT';
// }

// /** Возвращается, когда произошло исключение при проверки типа, десериализации или вообще в процессе работы */
// interface IErrorResult {
//   result: 'INVALID_DATA' | 'ERROR';
//   message?: string;
// }

export type RobustRequest = (params: IRequestParams) => Promise<TResponse>;

export const robustRequest: RobustRequest = async ({
  api,
  method,
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
  }, timeout);

  try {
    const config = { params: urlParams, signal: controller.signal };

    let res: AxiosResponse<ServerResponse, any>;
    switch (method) {
      case 'GET': {
        res = await api.get(url, config);
        break;
      }
      case 'POST': {
        res = await api.post(url, data, config);
        break;
      }
      case 'PATCH': {
        res = await api.patch(url, data, config);
        break;
      }
      case 'DELETE': {
        res = await api.delete(url, config);
        break;
      }
      default:
        return {
          type: 'ERROR',
        };
    }
    clearTimeout(rTimeout);

    let objData = res.data;

    //Проверка данных validator
    if (res.data.type === 'SUCCESS') {
      const bodyData = res.data.data;
      if (validator) {
        validator(bodyData);
      }

      //Десериализация данных deserializer
      objData = { ...bodyData, data: deserializer ? deserializer(bodyData) : bodyData };
    } else if (validator) {
      return {
        type: 'INVALID_DATA',
      };
    }

    return objData;
    // return {
    //   result: 'OK',
    //   response: {
    //     status: res.status,
    //     data: objData,
    //   },
    // };
  } catch (err) {
    clearTimeout(rTimeout);

    if (controller.signal.aborted) {
      return {
        type: 'SERVER_TIMEOUT',
      };
    }

    if (err instanceof AxiosError) {
      if (err.response?.status) {
        return {
          type: 'FAILURE',
          status: err.response.status || 500,
          error: err.response.data || '',
        };
      } else {
        return {
          type: 'NO_CONNECTION',
        };
      }
    }

    return {
      type: 'ERROR',
    };
  }
};
