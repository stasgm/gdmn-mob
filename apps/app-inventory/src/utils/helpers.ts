import { log } from '@lib/mobile-app';
import { IDepartment, INamedEntity } from '@lib/types';

import { IGood, IMGoodData, IMGoodRemain, IModelRem, IRemains, IRemainsData, IRemGood } from '../store/app/types';

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

const getRemGoodByContact = (
  contacts: IDepartment[],
  goods: IGood[],
  remains: IRemains,
  contactId: string,
  isRemains: boolean | undefined = false,
) => {
  log('getRemGoodByContact', `Начало построения модели товаров по баркоду по подразделению ${contactId}`);

  const remGoods: IMGoodData<IMGoodRemain> = {};
  const contact = contacts.find((con) => con.id === contactId);

  if (contact && goods.length) {
    log('getRemGoodByContact', `подразделение: ${contact.name}`);

    if (remains && remains[contactId]) {
      //Формируем объект остатков тмц
      const remainsByGoodId = remains[contactId].reduce((p: any, { goodId, price, q }: IRemainsData) => {
        const x = p[goodId];
        if (!x) {
          p[goodId] = [{ price, q }];
        } else {
          x.push({ price, q });
        }
        return p;
      }, {});

      //Заполняем объект товаров по штрихкоду, если есть шк и (выбор не из остатков или есть остатки по товару)
      for (const good of goods) {
        if (good.barcode && (!isRemains || remainsByGoodId[good.id])) {
          remGoods[good.barcode] = {
            good,
            remains: remainsByGoodId ? remainsByGoodId[good.id] : [],
          };
        }
      }
    } else if (!isRemains) {
      //Если по контакту нет остатков и выбор не из остатков, добавляем объект товара без remains
      for (const good of goods) {
        if (good.barcode) {
          remGoods[good.barcode] = { good };
        }
      }
    }
  }

  log('getRemGoodByContact', `Окончание построения модели товаров по баркоду по подразделению ${contactId}`);
  return remGoods;
};

const getRemGoodListByContact = (
  contacts: IDepartment[],
  goods: IGood[],
  remains: IRemains,
  contactId: string,
  isRemains: boolean | undefined = false,
) => {
  log('getRemGoodListByContact', `Начало построения массива товаров по подразделению ${contactId}`);

  const remGoods: IRemGood[] = [];
  const c = contacts.find((con) => con.id === contactId);
  if (c && goods.length) {
    log('getRemGoodListByContact', `подразделение: ${c.name}`);

    if (remains && remains[contactId]) {
      //Формируем объект остатков тмц
      const remainsByGoodId = remains[contactId].reduce(
        (p: IMGoodData<IModelRem[]>, { goodId, price = 0, q = 0 }: IRemainsData) => {
          const x = p[goodId];
          if (!x) {
            p[goodId] = [{ price, q }];
          } else {
            x.push({ price, q });
          }
          return p;
        },
        {},
      );

      //Формируем массив товаров, добавив свойство цены и остатка
      for (const good of goods) {
        if (remainsByGoodId && remainsByGoodId[good.id]) {
          for (const r of remainsByGoodId[good.id]) {
            remGoods.push({
              good,
              price: r.price,
              remains: r.q,
            });
          }
        } else if (!isRemains) {
          remGoods.push({
            good,
            price: 0,
            remains: 0,
          });
        }
      }
    } else if (!isRemains) {
      //Если по контакту нет остатков и выбор не из остатков, добавляем объект товара c 0
      for (const good of goods) {
        remGoods.push({ good, price: 0, remains: 0 });
      }
    }
  }

  log('getRemGoodListByContact', `Окончание построения массива товаров по подразделению ${contactId}`);
  return remGoods;
};

export { extraPredicate, isNamedEntity, formatValue, getRemGoodByContact, getRemGoodListByContact };
