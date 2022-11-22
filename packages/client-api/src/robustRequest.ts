import { IResponse } from '@lib/types';
import { AxiosResponse } from 'axios';
import { config } from '@lib/client-config';

// import api from './api';

/** Функция, вызывается при неверной авторизации */
export type AuthLogOut = () => Promise<any>;

/** Валидатор проверяет полученные данные на корректность. В случае ошибки генерирует исключение. */
type Validator = (data: Record<string, unknown>) => void;

/** Десериализатор, если есть, может одновременно являться  и валидатором. */
type Deserializer = <T>(data: Record<string, unknown>) => T;

interface IURLParams {
  [paramName: string]: string | number;
}

export interface IRequestParams {
  api: any;
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

    let res: AxiosResponse<IResponse, any> | undefined = undefined;

    switch (method) {
      case 'GET': {
        console.log('get', url, config);
        res = await api.axios.get(url, config);
        break;
      }
      case 'POST': {
        console.log('post', url, config, data);
        res = await api.axios.post(url, data, config);
        break;
      }
      case 'PUT': {
        res = await api.axios.put(url, data, config);
        break;
      }
      case 'DELETE': {
        res = await api.axios.delete(url, config);
        break;
      }
    }

    clearTimeout(rTimeout);

    let objData = res?.data;

    // if (res?.data.status === 401 && authFunc) {
    //   await authFunc();
    // } else {
    //Проверка данных validator
    if (res?.data?.data) {
      if (validator) {
        validator(res.data.data);
      }

      //Десериализация данных deserializer
      objData = { ...res.data, data: deserializer ? deserializer(res.data.data) : res.data.data };
    } else if (validator) {
      return {
        result: 'INVALID_DATA',
        message: 'Empty server response',
      };
    }
    // }

    return {
      result: 'OK',
      response: {
        status: res!.status || 200,
        data: objData,
      },
    } as IServerResponseResult;
  } catch (err) {
    clearTimeout(rTimeout);

    if (controller.signal.aborted) {
      return {
        result: 'TIMEOUT',
      };
    }

    console.log('err', err);
    // //Если пришел ответ с ошибкой сети
    // if (err instanceof AxiosError) {
    //   const code = err.code;
    //   if (code === 'ECONNABORTED' || code === 'ERR_NETWORK') {
    //     return {
    //       result: code === 'ECONNABORTED' ? 'TIMEOUT' : 'NO_CONNECTION',
    //     };
    //   }
    // }

    return {
      result: 'SERVER_ERROR',
      response: {
        status: 500,
        data: err,
      },
    };
  }
};
