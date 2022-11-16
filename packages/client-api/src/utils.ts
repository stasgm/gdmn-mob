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
