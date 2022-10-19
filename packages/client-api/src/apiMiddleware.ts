import { IResponse } from '@lib/types';
import { AxiosResponse } from 'axios';
import { config } from '@lib/client-config';

import api from './api';

/** Валидатор проверяет полученные данные на корректность. В случае ошибки генерирует исключение. */
type Validator = (data: Record<string, unknown>) => void;

/** Десериализатор, если есть, может одновременно являться  и валидатором. */
type Deserializer = (data: Record<string, unknown>) => Record<string, unknown>;

interface IURLParams {
  [paramName: string]: string | number;
}

interface IRequestParams {
  /** method HTTP. По умолчанию подставляется GET. */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
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

type RequestResult<T> = IServerResponseResult<T> | IServerUnreacheableResult | IErrorResult;

interface IServerResponseResult<T> {
  /** 2xx, 4xx, 5xx */
  result: 'OK' | 'CLIENT_ERROR' | 'SERVER_ERROR';
  response: {
    /** HTTP response status */
    status: number;
    data?: T;
  };
}

interface IServerUnreacheableResult {
  result: 'NO_CONNECTION' | 'TIMEOUT';
}

/** Возвращается, когда произошло исключение при проверки типа, десериализации или вообще в процессе работы */
interface IErrorResult {
  result: 'INVALID_DATA' | 'ERROR';
  message?: string;
}

export type RobustRequestMiddleware = <T>(params: IRequestParams) => Promise<RequestResult<IResponse<T>>>;

export const robustRequest: RobustRequestMiddleware = async <T>({
  method,
  baseUrl,
  url,
  params,
  data,
  validator,
  deserializer,
  timeout = config.timeout,
}: IRequestParams) => {
  let urlParams: URLSearchParams | undefined;

  if (params) {
    urlParams = new URLSearchParams();
    Object.entries(params).forEach(([field, value]) => {
      urlParams!.append(field, `${value}`);
    });
  }

  const controller = new AbortController();

  const rTimeout = setTimeout(() => {
    controller.abort();
    console.log('Aborted');
  }, timeout);

  try {
    const config = { params: urlParams, signal: controller.signal };

    let res: AxiosResponse<IResponse<T>, any> | undefined = undefined;

    switch (method) {
      case 'GET': {
        res = await api.axios.get<IResponse<T>>(url, config);
        break;
      }
      case 'POST': {
        res = await api.axios.post<IResponse<T>>(url, data, config);
        break;
      }
      case 'PUT': {
        res = await api.axios.put<IResponse<T>>(url, data, config);
        break;
      }
      case 'DELETE': {
        res = await api.axios.delete<IResponse<T>>(url, config);
        break;
      }
    }

    clearTimeout(rTimeout);

    //TODO Проверка данных validator
    //TODO Десериализация данных deserializer

    return {
      result: 'OK',
      response: {
        status: res!.status || 200,
        data: res?.data,
      },
    } as IServerResponseResult<T>;
  } catch (err) {
    clearTimeout(rTimeout);

    if (controller.signal.aborted) {
      return {
        result: 'TIMEOUT',
      };
    }

    return {
      result: 'SERVER_ERROR',
      response: {
        status: 500,
        // data: err,
      },
    };
  }
};
