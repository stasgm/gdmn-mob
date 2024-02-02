import { IDBHeadMessage, IDBMessage } from '@lib/types';
import { customAlphabet } from 'nanoid';

const extraPredicate = (item: any, params: Record<string, string>) => {
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

const getListPart = (list: any[], params: Record<string, string | number>) => {
  /* pagination */
  const limitParams = Object.assign({}, params);

  let fromRecord = 0;
  if ('fromRecord' in limitParams && typeof limitParams.fromRecord === 'number') {
    fromRecord = limitParams.fromRecord;
  }

  let toRecord = list.length;
  if ('toRecord' in limitParams && typeof limitParams.toRecord === 'number')
    toRecord = limitParams.toRecord > 0 ? limitParams.toRecord : toRecord;

  return list.slice(fromRecord, toRecord);
};

const generateId = () => {
  return customAlphabet('1234567890abcdef', 10)();
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

const isPositiveFiniteNumber = (value: any): value is number =>
  typeof value === 'string' && isFinite(Number(value)) && Number(value) >= 0;

const processStringFields = (params: Record<string, any>, query: Record<string, any>, fields: string[]) => {
  fields.forEach((field) => {
    if (isNonEmptyString(query[field])) {
      params[field] = query[field];
    }
  });
};

const processNumberFields = (params: Record<string, string | number>, query: Record<string, any>, fields: string[]) => {
  fields.forEach((field) => {
    if (isPositiveFiniteNumber(query[field])) {
      params[field] = Number(query[field]);
    }
  });
};

export { extraPredicate, getListPart, generateId, isIDBMessage, processStringFields, processNumberFields };
