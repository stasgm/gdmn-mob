import { INamedEntity } from '@lib/types';

import {
  IGood,
  IMGoodData,
  IMGoodRemain,
  IModelRem,
  IRemains,
  IRemainsData,
  IRemainsNew,
  IRemGood,
} from '../store/app/types';
import { IContact } from '../store/types';

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

export const getRemGoodByContact = (contacts: IContact[], goods: IGood[], remains: IRemainsNew, contactId: string) => {
  console.log('getRemGoodByContact', `Начало построения модели товаров по баркоду по подразделению ${contactId}`);

  const remGoods: IMGoodData<IMGoodRemain> = {};
  const contact = contacts.find((con) => con.id === contactId);

  if (contact && goods.length) {
    console.log('getRemGoodByContact', `подразделение: ${contact.name}`);

    if (remains && remains[contactId]) {
      //Формируем объект остатков тмц
      const remainsByGoodId = remains[contactId].reduce((p: any, { goodId, price, buyingPrice, q }: IRemainsData) => {
        const x = p[goodId];
        if (!x) {
          p[goodId] = [{ price, buyingPrice, q }];
        } else {
          x.push({ price, buyingPrice, q });
        }
        return p;
      }, {});

      //Заполняем объект товаров по штрихкоду, если есть шк
      for (const good of goods) {
        if (good.barcode) {
          remGoods[good.barcode] = {
            good,
            remains: remainsByGoodId ? remainsByGoodId[good.id] : [],
          };
        }
      }
    } else {
      //Если по товару нет остатков, добавляем объект товара без remains
      for (const good of goods) {
        if (good.barcode) {
          remGoods[good.barcode] = { good };
        }
      }
    }
  }

  console.log('getRemGoodByContact', `Окончание построения модели товаров по баркоду по подразделению ${contactId}`);
  return remGoods;
};

export const getRemGoodListByContact = (
  contacts: IContact[],
  goods: IGood[],
  remains: IRemainsNew, //IRemains[],
  contactId: string,
) => {
  console.log('getRemGoodListByContact', `Начало построения массива товаров по подразделению ${contactId}`);

  const remGoods: IRemGood[] = [];
  const c = contacts.find((con) => con.id === contactId);
  if (c && goods.length) {
    console.log('getRemGoodListByContact', `подразделение: ${c.name}`);

    //Формируем объект остатков тмц
    const remainsByGoodId = remains[contactId].reduce(
      (p: IMGoodData<IModelRem[]>, { goodId, price = 0, buyingPrice = 0, q = 0 }: IRemainsData) => {
        const x = p[goodId];
        if (!x) {
          p[goodId] = [{ price, buyingPrice, q }];
        } else {
          x.push({ price, buyingPrice, q });
        }
        return p;
      },
      {},
    );

    //Формируем массив товаров, добавив свойство цены и остатка
    // goods.reduce((remGoods: IRemGood[], good: IGood) => {
    //   if (remainsByGoodId && remainsByGoodId[good.id]) {
    //     for (const r of remainsByGoodId[good.id]) {
    //       remGoods.push({
    //         good,
    //         price: r.price,
    //         remains: r.q,
    //       });
    //     }
    //   } else {
    //     remGoods.push({
    //       good,
    //       price: 0,
    //       remains: 0,
    //     });
    //   }
    //   return remGoods;
    // }, remGoods);
    for (const good of goods) {
      if (remainsByGoodId && remainsByGoodId[good.id]) {
        for (const r of remainsByGoodId[good.id]) {
          remGoods.push({
            good,
            price: r.price,
            buyingPrice: r.buyingPrice,
            remains: r.q,
          });
        }
      } else {
        remGoods.push({
          good,
          price: 0,
          buyingPrice: 0,
          remains: 0,
        });
      }
    }
  }

  console.log('getRemGoodListByContact', `Окончание построения массива товаров по подразделению ${contactId}`);
  return remGoods;
};
