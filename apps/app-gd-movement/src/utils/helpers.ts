import { log } from '@lib/mobile-hooks';
import { IDocument } from '@lib/types';

import { IGood, IMGoodData, IMGoodRemain, IModelRem, IRemainsData, IRemGood } from '../store/app/types';

export const getNextDocNumber = (documents: IDocument[]) => {
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
const getRemGoodByContact = (
  goods: IGood[],
  remains: IRemainsData[] = [],
  isRemains: boolean | undefined = false,
  noZeroRemains = false,
) => {
  log('getRemGoodByContact', 'Начало построения модели товаров по подразделению в разрезе штрихкодов');
  const remGoods: IMGoodData<IMGoodRemain> = {};

  if (goods.length) {
    if (remains.length) {
      //Формируем объект остатков тмц
      const remainsByGoodId = getRemainsByGoodId(remains, noZeroRemains);

      //Заполняем объект товаров по штрихкоду, если есть шк и (выбор не из остатков или есть остатки по товару)
      for (const good of goods) {
        const code = good.barcode || good.weightCode || good.alias;
        if (code && (!isRemains || remainsByGoodId[good.id])) {
          remGoods[code] = {
            good,
            remains: remainsByGoodId ? remainsByGoodId[good.id] : [],
          };
        }
      }
    } else if (!isRemains) {
      //Если по контакту нет остатков и  выбор не из остатков, добавляем объект товара без remains
      for (const good of goods) {
        const code = good.barcode || good.weightCode || good.alias;
        if (code) {
          remGoods[code] = { good };
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
const getRemGoodListByContact = (
  goods: IGood[],
  remains: IRemainsData[] = [],
  isRemains: boolean | undefined = false,
  noZeroRemains = false,
) => {
  log('getRemGoodListByContact', 'Начало построения массива товаров по подразделению');

  const remGoods: IRemGood[] = [];
  if (goods.length) {
    //Если есть остатки, то формируем модель остатков по ид товара
    if (remains.length) {
      //Формируем объект остатков тмц
      const remainsByGoodId = getRemainsByGoodId(remains, noZeroRemains);

      //Формируем массив товаров, добавив свойство цены и остатка
      //Если по товару нет остатков и если модель не для выбора из справочника тмц, (не из остатков)
      //то добавляем запись с нулевыми значениями цены и остатка
      for (const good of goods) {
        if (remainsByGoodId && remainsByGoodId[good.id]) {
          for (const r of remainsByGoodId[good.id]) {
            //Если isRemains true, showZeroRemains false и "isControlRemains" true, то в модель такие товары не добавляем
            if (!noZeroRemains || r.q !== 0) {
              remGoods.push({
                good,
                price: r.price,
                buyingPrice: r.buyingPrice,
                remains: r.q,
              });
            }
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
const getRemainsByGoodId = (remains: IRemainsData[], noZeroRemains = false) => {
  return remains.reduce((p: IMGoodData<IModelRem[]>, { goodId, price = 0, buyingPrice = 0, q = 0 }: IRemainsData) => {
    const x = p[goodId];
    if (!noZeroRemains || q !== 0) {
      if (!x) {
        p[goodId] = [{ price, buyingPrice, q }];
      } else {
        x.push({ price, buyingPrice, q });
      }
    }
    return p;
  }, {});
};

export { getRemGoodByContact, getRemGoodListByContact };

export const jsonFormat = (str: any) => {
  return JSON.stringify(str, null, '\t');
};

export const getBrc = (brc: string, prefixGtin: string, goodRemains: IMGoodData<IMGoodRemain>) => {
  return prefixGtin === brc.slice(0, 2)
    ? goodRemains[brc.slice(2, 16)] || goodRemains[brc.slice(3, 16)]
    : goodRemains[brc];
};
