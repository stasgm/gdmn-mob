import { INamedEntity } from '@lib/types';

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

const isNamedEntity = (obj: any): obj is INamedEntity => {
  return typeof obj === 'object' && 'name' in obj;
};

export type NumberFormat = 'currency' | 'number' | 'percentage';

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

export { extraPredicate, isNamedEntity, formatValue };
