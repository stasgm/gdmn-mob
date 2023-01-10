import { Alert, Linking, Platform } from 'react-native';

import { IEntity, INamedEntity, IReferences } from '@lib/types';
import 'react-native-get-random-values';
import { customAlphabet } from 'nanoid';

import { IDelList } from '@lib/mobile-types';

const sleep = (ms: number): Promise<undefined> => new Promise((resolve) => setTimeout(resolve, ms));

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

const shortenString = (word: string, maxLenght: number) => {
  return word.length > maxLenght ? word.substring(0, maxLenght - 3) + '...' : word;
};

const isNamedEntity = (obj: any): obj is INamedEntity => {
  return typeof obj === 'object' && 'name' in obj;
};

const isNumeric = (value: any) => {
  if (typeof value === 'number') {
    return true;
  } else if (typeof value !== 'string') {
    return false;
  }
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
};

const isIReferences = (obj: any): obj is IReferences => {
  if (typeof obj === 'object') {
    const data = Object.values(obj);
    if (Array.isArray(data)) {
      const refData = data[0];
      return (
        typeof refData === 'object' &&
        isNamedEntity(refData) &&
        'data' in refData &&
        Array.isArray((refData as any).data)
      );
    }
  }
  return false;
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

const round = (value: number, x = 2) => {
  const d = parseFloat('1'.padEnd(1 + x, '0'));
  return Math.round((value + Number.EPSILON) * d) / d;
};

const generateId = () => customAlphabet('1234567890abcdef', 10)();

const dialCall = (number: string) => {
  let phoneNumber = '';
  if (Platform.OS === 'android') {
    phoneNumber = `tel:${number}`;
  } else {
    phoneNumber = `telprompt:${number}`;
  }
  Linking.openURL(phoneNumber);
};

const keyExtractor = (item: IEntity) => String(item.id);

const getDelList = (delList: IDelList, lineId: string, lineStatus: string) => {
  const newList = { ...delList };
  if (newList[lineId]) {
    delete newList[lineId];
  } else {
    newList[lineId] = lineStatus;
  }

  return newList;
};

const getDelLineList = (delList: string[], lineId: string) =>
  delList.includes(lineId) ? delList.filter((i) => i !== lineId) : [...delList, lineId];

const deleteSelectedItems = (delList: IDelList, deleteDocs: () => void) => {
  if (Object.values(delList).find((i) => i === 'SENT')) {
    Alert.alert('Внимание!', 'Среди выделенных документов есть отправленные. Удаление невозможно.', [
      {
        text: 'ОК',
      },
    ]);
  } else if (Object.values(delList).find((i) => i === 'READY')) {
    Alert.alert('Внимание!', 'Среди выделенных документов есть необработанные. Продолжить удаление?', [
      {
        text: 'Да',
        onPress: deleteDocs,
      },
      {
        text: 'Отмена',
      },
    ]);
  } else {
    Alert.alert('Вы уверены, что хотите удалить документы?', '', [
      {
        text: 'Да',
        onPress: deleteDocs,
      },
      {
        text: 'Отмена',
      },
    ]);
  }
};

const deleteSelectedLineItems = (deleteDocs: () => void) =>
  Alert.alert('Вы уверены, что хотите удалить позиции документа?', '', [
    {
      text: 'Да',
      onPress: deleteDocs,
    },
    {
      text: 'Отмена',
    },
  ]);

export {
  truncate,
  log,
  getDateString,
  shortenString,
  extraPredicate,
  isNamedEntity,
  isNumeric,
  isIReferences,
  formatValue,
  round,
  generateId,
  dialCall,
  keyExtractor,
  getDelList,
  deleteSelectedItems,
  getDelLineList,
  deleteSelectedLineItems,
  sleep,
};
