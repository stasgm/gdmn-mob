import { config } from '@lib/client-config';
import { ServerResponse, TResponse } from '@lib/types';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

/** Функция, вызывается при неверной авторизации */
export type AuthLogOut = () => Promise<any>;

export type CustomRequest = <T>(params: IRequestParams) => Promise<TResponse<T>>;

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

  const rTimeout: NodeJS.Timeout = setTimeout(() => {
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
      objData = { ...res.data, data: deserializer ? deserializer(bodyData) : bodyData };
    } else if (validator) {
      return {
        type: 'INVALID_DATA',
      };
    }

    return objData;
  } catch (err) {
    clearTimeout(rTimeout);

    if (controller.signal.aborted) {
      return {
        type: 'SERVER_TIMEOUT',
      };
    }

    if (err instanceof AxiosError) {
      if (err.response?.status) {
        let errorMessage = '';
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data && typeof err.response.data.error === 'string') {
          errorMessage = err.response.data.error;
        }
        return {
          result: false,
          type: 'FAILURE',
          status: err.response.status || 500,
          error: errorMessage || 'Ошибка axious',
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
