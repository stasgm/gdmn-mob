import { TResponse } from '@lib/types';
import { customAlphabet } from 'nanoid';

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getParams = (params: Record<string, string | number | undefined>) => {
  return Object.entries(params).reduce((acc, [field, value]) => {
    let curParam = '';
    if (acc > '') {
      curParam = `${acc}&`;
    }
    return `${curParam}${field}=${value}`;
  }, '');
};

export const generateId = () => {
  return customAlphabet('1234567890abcdef', 10)();
};

export const response2Log = (r: TResponse) => {
  switch (r.type) {
    case 'NO_CONNECTION':
      return 'Нет сетевого соединения';

    case 'SERVER_TIMEOUT':
      return 'Нет доступа к серверу';

    case 'INVALID_DATA':
      return 'Неверный формат данных';

    case 'FAILURE':
      return r.error;

    default:
      return undefined;
  }
};

export const isConnectError = (type: string) => type === 'NO_CONNECTION' || type === 'SERVER_TIMEOUT';
