import { IDBHeadMessage, IDBMessage } from '@lib/types';
import { customAlphabet } from 'nanoid';

import { IParamsInfo } from '../types';

const extraPredicate = (item: any, params: Record<string, string>) => {
  let matched = 0;

  const paramsEntries = Object.entries(params);

  for (const [param, value] of paramsEntries) {
    if (param in item) {
      if (
        (typeof item[param] === 'object' &&
          param.toUpperCase().includes('ID') &&
          item[param].id.toUpperCase() === value.toUpperCase()) ||
        (typeof item[param] === 'object' &&
          'name' in item[param] &&
          item[param].name.toUpperCase() === value.toUpperCase()) ||
        (typeof item[param] === 'string' && item[param].toUpperCase() === value.toUpperCase())
      ) {
        matched++;
      } else {
        break;
      }
    }
  }
  return matched === paramsEntries.length;
};

const isPositiveFiniteNumber = (value: any): value is number =>
  typeof value === 'string' && isFinite(Number(value)) && Number(value) >= 0;

const getListPart = <T = any>(list: any[], params: Record<string, string | number>) => {
  /* pagination */
  const limitParams = Object.assign({}, params);

  let fromRecord = 0;
  if ('fromRecord' in limitParams && isPositiveFiniteNumber(limitParams.fromRecord)) {
    fromRecord = Number(limitParams.fromRecord);
  }

  let toRecord = list.length;
  if ('toRecord' in limitParams && isPositiveFiniteNumber(limitParams.toRecord)) {
    const toRecordLimit = Number(limitParams.toRecord);
    toRecord = toRecordLimit > 0 ? toRecordLimit : toRecord;
  }

  return list.slice(fromRecord, toRecord) as T[];
};

const generateId = () => {
  return customAlphabet('1234567890abcdef', 10)();
};

const getListPartByParams = <T = any>(list: any[], params: IParamsInfo) => {
  /* pagination */
  const limitParams = Object.assign({}, params);

  let fromRecord = 0;
  if ('fromRecord' in limitParams && isPositiveFiniteNumber(limitParams.fromRecord.value)) {
    fromRecord = Number(limitParams.fromRecord.value);
  }

  let toRecord = list.length;
  if ('toRecord' in limitParams && isPositiveFiniteNumber(limitParams.toRecord.value)) {
    const toRecordLimit = Number(limitParams.toRecord.value);
    toRecord = toRecordLimit > 0 ? toRecordLimit : toRecord;
  }

  return list.slice(fromRecord, toRecord) as T[];
};

//TODO: добавить более специфические условия проверки
function isIDBHeadMessage(obj: any): obj is IDBHeadMessage {
  return typeof obj === 'object';
}

//TODO: добавить более специфические условия проверки
function isIDBMessage(obj: any): obj is IDBMessage {
  return obj['body']['version'] === 1 && isIDBHeadMessage(obj['head']);
}

const isNonEmptyString = (value: any): value is string => typeof value === 'string' && value.trim().length > 0;

// /**
//  * Формирует объект параметров из не пустых строковых значений
//  * @param params
//  * @param query
//  * @param fields
//  */
// const prepareParams = (query: Record<string, any>, fields: string[]) => {
//   const params: Record<string, string> = {};
//   fields.forEach((field) => {
//     if (isNonEmptyString(query[field])) {
//       params[field] = query[field];
//     }
//   });
//   return params;
// };

// const processNumberFields = (query: Record<string, any>, fields: string[]) => {
//   const params: Record<string, number> = {};
//   fields.forEach((field) => {
//     if (isPositiveFiniteNumber(query[field])) {
//       params[field] = Number(query[field]);
//     }
//   });
//   return params;
// };

/**
 * Формирует объект параметров из непустых строковых значений и числовых значений
 * @param query
 * @param stringFields
 * @param numberFields
 * @returns
 */
const prepareParams = <T = Record<string, string>>(
  query: Record<string, any>,
  stringFields?: string[],
  numberFields?: string[],
) => {
  const params: Record<string, any> = {};

  stringFields?.forEach((field) => {
    if (isNonEmptyString(query[field])) {
      params[field] = query[field];
    }
  });

  numberFields?.forEach((field) => {
    if (isPositiveFiniteNumber(query[field])) {
      params[field] = Number(query[field]);
    }
  });

  return params as T;
};

function formatDateToLocale(date: string | Date = '') {
  return new Date(date).toLocaleString('ru', { hour12: false });
}

/**
 * Проверка формата даты YYYY-MM-DDTHH:MM:SS или YYYY-MM-DD
 * @param value
 * @returns
 */
const checkDateFormat = (value: any) => {
  if (!/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3}Z)?)?$/.test(value)) {
    throw new Error('Неверный формат даты. Ожидается YYYY-MM-DDTHH:MM:SS.sssZ, YYYY-MM-DDTHH:MM:SS или YYYY-MM-DD');
  }

  const dateValue = new Date(value);
  if (isNaN(dateValue.getTime())) {
    throw new Error('Неверный формат даты. Ожидается YYYY-MM-DDTHH:MM:SS или YYYY-MM-DD');
  }
  return value;
};

const isAllParamMatched = (item: any, paramsInfo: IParamsInfo) => {
  for (const [key, param] of Object.entries(paramsInfo)) {
    const { itemKey, property, fullMatch, comparator } = paramsInfo[key];
    let itemValue = property ? item[itemKey]?.[property] : item[itemKey];
    let compareValue = param.value;

    if (comparator && compareValue) {
      itemValue = new Date(itemValue).getTime();
      compareValue = new Date(compareValue).getTime();

      if (!comparator(itemValue, compareValue)) {
        return false;
      }
    } else {
      itemValue = typeof itemValue === 'string' ? itemValue.toUpperCase() : itemValue;
      compareValue = typeof param.value === 'string' ? param.value.toUpperCase() : param.value;
      const isIdFound = fullMatch ? itemValue === compareValue : itemValue?.includes(compareValue);
      if (!isIdFound) {
        return false;
      }
    }
  }
  return true;
};

// const isAllParamMatched = (newParams: Record<string, string>, item: any, paramsInfo: IParamsInfo) => {
//   for (const [key, value] of Object.entries(newParams)) {
//     if (!(key in paramsInfo)) continue;

//     const { itemKey, property, fullMatch, comparator } = paramsInfo[key];
//     const itemValue = ((property ? item[itemKey]?.[property] : item[itemKey]) || '').toUpperCase();
//     const compareValue = value.toUpperCase();
//     if (comparator) {
//       const date = new Date(formatDateToLocale(itemValue)).getTime();
//       const dateParam = new Date(formatDateToLocale(compareValue)).getTime();
//       if (!comparator(date, dateParam)) {
//         return false;
//       }
//     } else {
//       const isIdFound = fullMatch ? itemValue === compareValue : itemValue?.includes(compareValue);
//       if (!isIdFound) {
//         return false;
//       }
//     }
//   }
//   return true;
// };

export {
  extraPredicate,
  getListPart,
  generateId,
  isIDBMessage,
  prepareParams,
  formatDateToLocale,
  checkDateFormat,
  isAllParamMatched,
  getListPartByParams,
};
