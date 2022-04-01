import { INamedEntity } from '@lib/types';

const truncate = (str: string, l: number | undefined = 40) => (str.length > l ? `${str.substring(0, l)}...` : str);

const log = (...message: string[]) => {
  if (__DEV__) {
    console.log(new Date().toTimeString(), ...message);
  }
};

const getDateString = (_date: string | Date) => {
  if (!_date) {
    return '-';
  }
  const date = new Date(_date);
  return `${('0' + date.getDate()).toString().slice(-2, 3)}.${('0' + (date.getMonth() + 1).toString()).slice(
    -2,
    3,
  )}.${date.getFullYear()}`;
};

const extraPredicate = <T>(item: T, params: Record<string, string>) => {
  let matched = 0;

  const paramsEntries = Object.entries(params);

  for (const [param, value] of paramsEntries) {
    if (param in item) {
      if (((item as any)[param] as string).toUpperCase() === value.toUpperCase()) {
        matched++;
      } else {
        break;
      }
    }
  }
  return matched === paramsEntries.length;
};

const shortenString = (word: string, maxLenght: number) => {
  return word.length > maxLenght ? word.substring(0, maxLenght - 3) + '...' : word;
};

const isNamedEntity = (obj: any): obj is INamedEntity => {
  return typeof obj === 'object' && 'name' in obj;
};

type NumberFormat = 'currency' | 'number' | 'percentage';

interface INumberFormat {
  type: NumberFormat;
  decimals: number;
}

const formatValue = (format: NumberFormat | INumberFormat, value: number | string) => {
  const type = typeof format === 'string' ? format : format.type;
  const decimals = typeof format === 'string' ? 2 : format.decimals;

  const transform = function (org: number, n: number, x: number, s: string, c: string) {
    const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : 'р') + ')',
      num = org.toFixed(Math.max(0, Math.floor(n)));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
  };

  value = typeof value === 'string' ? parseFloat(value) : value;

  switch (type) {
    case 'currency':
      return `${transform(value, decimals, 3, ' ', ',')} р.`;
    case 'number':
      return `${transform(value, decimals, 3, ' ', ',')}`;
    case 'percentage':
      return `${transform(value, decimals, 3, ' ', ',')} %`;
    default:
      return value;
  }
};

export { truncate, log, getDateString, shortenString, extraPredicate, isNamedEntity, formatValue };
