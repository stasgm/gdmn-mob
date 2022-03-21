import { log } from '@lib/mobile-app';
import { INamedEntity } from '@lib/types';

import { IGood, IMGoodData, IMGoodRemain, IModelRem, IRemainsData, IRemGood } from '../store/app/types';
import { IMovementDocument } from '../store/types';

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

export const getNextDocNumber = (documents: IMovementDocument[]) => {
  return (
    documents
      ?.map((item) => parseInt(item.number, 10))
      .reduce((newId, currId) => (newId > currId ? newId : currId), 0) + 1 || 1
  ).toString();
};

/**Возвращает модель товаров с информацией по остаткам в виде:
  { "123456789" : { good: { id: '1', name: 'Товар 1', value: 'шт.', ...}, remains: [{ price: 1.2, q: 1 }, { price: 1.3, q: 2 }]},
    "987654321" : { good: { id: '2', name: 'Товар 2', value: 'шт.', ...}, remains: [{ price: 1.3, q: 1 }, { price: 1.4, q: 2 }]},
    "111111111" : { good: { id: '3', name: 'Товар 3', value: 'шт.', ...}},
  }
*/
const getRemGoodByContact = (goods: IGood[], remains: IRemainsData[], isRemains: boolean | undefined = false) => {
  log('getRemGoodByContact', 'Начало построения модели товаров по подразделению в разрезе штрихкодов');

  const remGoods: IMGoodData<IMGoodRemain> = {};

  if (goods.length) {
    if (remains.length) {
      //Формируем объект остатков тмц
      const remainsByGoodId = getRemainsByGoodId(remains);

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
      //Если по контакту нет остатков и  выбор не из остатков, добавляем объект товара без remains
      for (const good of goods) {
        if (good.barcode) {
          remGoods[good.barcode] = { good };
        }
      }
    }
  }

  log('getRemGoodByContact', 'Окончание построения модели товаров по подразделению в разрезе штрихкодов');
  return remGoods;
};

/**Возвращает модель товаров с информацией по остаткам в виде:
  [
    { good: { id: '1', name: 'Товар 1', value: 'шт.', ...}, price: 1.2, remains: 1},
    { good: { id: '1', name: 'Товар 1', value: 'шт.', ...}, price: 1.3, remains: 3},
    { good: { id: '2', name: 'Товар 2', value: 'шт.', ...}, price: 0, remains: 0}
  ]
*/
const getRemGoodListByContact = (goods: IGood[], remains: IRemainsData[], isRemains: boolean | undefined = false) => {
  log('getRemGoodListByContact', 'Начало построения массива товаров по подразделению');

  const remGoods: IRemGood[] = [];
  if (goods.length) {
    //Если есть остатки, то формируем модель остатков по ид товара
    if (remains.length) {
      //Формируем объект остатков тмц
      const remainsByGoodId = getRemainsByGoodId(remains);

      //Формируем массив товаров, добавив свойство цены и остатка
      //Если по товару нет остатков и если модель не для выбора из справочника тмц, (не из остатков)
      //то добавляем запись с нулевыми значениями цены и остатка
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
        } else if (!isRemains) {
          remGoods.push({
            good,
            price: 0,
            buyingPrice: 0,
            remains: 0,
          });
        }
      }
    } else if (!isRemains) {
      //Если по контакту нет остатков и выбор не из остатков, добавляем объект товара c 0
      for (const good of goods) {
        remGoods.push({ good, price: 0, buyingPrice: 0, remains: 0 });
      }
    }
  }

  log('getRemGoodListByContact', 'Окончание построения массива товаров по подразделению');
  return remGoods;
};

//Возвращает объект остатков тмц, пример: {"1": [{ price: 1.2, q: 1 }, { price: 1.3, q: 2 }]}
const getRemainsByGoodId = (remains: IRemainsData[]) => {
  return remains.reduce((p: IMGoodData<IModelRem[]>, { goodId, price = 0, q = 0 }: IRemainsData) => {
    const x = p[goodId];
    if (!x) {
      p[goodId] = [{ price, q }];
    } else {
      x.push({ price, q });
    }
    return p;
  }, {});
};

export { extraPredicate, isNamedEntity, formatValue, getRemGoodByContact, getRemGoodListByContact };