import { addAbortSignal } from 'stream';

import { INamedEntity } from '@lib/types';
import { log } from '@lib/mobile-app';

import { IGood, IMatrixData } from '../store/types';

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

const isNamedEntity = (obj: any): obj is INamedEntity => {
  return typeof obj === 'object' && 'name' in obj;
};

const getTimeProcess = (db: string, de?: string) => {
  const diffMinutes = Math.floor(((de ? Date.parse(de) : Date.now()) - Date.parse(db)) / 60000);
  const hour = Math.floor(diffMinutes / 60);
  return `${hour} часов ${diffMinutes - hour * 60} минут`;
};

const twoDigits = (value: number) => {
  return value >= 10 ? value : `0${value}`;
};

// const getGoodMatrixGoodByContact = (
//   goods: IGood[],
//   remains: IMatrixData[] /*, isRemains: boolean | undefined = false*/,
// ) => {
//   log('getRemGoodByContact', 'Начало построения модели товаров по подразделению в разрезе штрихкодов');

//   const remGoods: IMGoodData<IMGoodRemain> = {};

//   if (goods.length) {
//     if (remains.length) {
//       //Формируем объект остатков тмц
//       const remainsByGoodId = getGoodMatrixByGoodId(remains);

//       //Заполняем объект товаров по штрихкоду, если есть шк и (выбор не из остатков или есть остатки по товару)
//       for (const good of goods) {
//         if (good.barcode && (!isRemains || remainsByGoodId[good.id])) {
//           remGoods[good.barcode] = {
//             good,
//             remains: remainsByGoodId ? remainsByGoodId[good.id] : [],
//           };
//         }
//       }
//     } else if (!isRemains) {
//       //Если по контакту нет остатков и  выбор не из остатков, добавляем объект товара без remains
//       for (const good of goods) {
//         if (good.barcode) {
//           remGoods[good.barcode] = { good };
//         }
//       }
//     }
//   }

//   log('getRemGoodByContact', 'Окончание построения модели товаров по подразделению в разрезе штрихкодов');
//   return remGoods;
// };

// const getGoodMatrixGoodListByContact = (
//   goods: IGood[],
//   remains: IMatrixData[],
//   isRemains: boolean | undefined = false,
// ) => {
//   log('getRemGoodListByContact', 'Начало построения массива товаров по подразделению');

//   const remGoods: IRemGood[] = [];
//   if (goods.length) {
//     //Если есть остатки, то формируем модель остатков по ид товара
//     if (remains.length) {
//       //Формируем объект остатков тмц
//       const remainsByGoodId = getGoodMatrixByGoodId(remains);

//       //Формируем массив товаров, добавив свойство цены и остатка
//       //Если по товару нет остатков и если модель не для выбора из справочника тмц, (не из остатков)
//       //то добавляем запись с нулевыми значениями цены и остатка
//       for (const good of goods) {
//         if (remainsByGoodId && remainsByGoodId[good.id]) {
//           for (const r of remainsByGoodId[good.id]) {
//             remGoods.push({
//               good,
//               price: r.price,
//               buyingPrice: r.buyingPrice,
//               remains: r.q,
//             });
//           }
//         } else if (!isRemains) {
//           remGoods.push({
//             good,
//             price: 0,
//             buyingPrice: 0,
//             remains: 0,
//           });
//         }
//       }
//     } else if (!isRemains) {
//       //Если по контакту нет остатков и выбор не из остатков, добавляем объект товара c 0
//       for (const good of goods) {
//         remGoods.push({ good, price: 0, buyingPrice: 0, remains: 0 });
//       }
//     }
//   }

//   log('getRemGoodListByContact', 'Окончание построения массива товаров по подразделению');
//   return remGoods;
// };

// const getGoodMatrixByGoodId = (goodMatrix: IMatrixData[]) => {
//   return goodMatrix.reduce((p: IMGoodData<IModelRem[]>, { goodId, price = 0, q = 0 }: IMatrixData) => {
//     const x = p[goodId];
//     if (!x) {
//       p[goodId] = [{ price, q }];
//     } else {
//       x.push({ price, q });
//     }
//     return p;
//   }, {});
// };

const getGoodMatrixGoodByContact = (
  goods: IGood[],
  goodMatrix: IMatrixData[] /*, isRemains: boolean | undefined = false*/,
) => {
  log('getRemGoodByContact', 'Начало построения модели товаров по подразделению в разрезе штрихкодов');

  const matrixGoods: IGood[] = [];
  for (const matrix of goodMatrix) {
    const good = goods?.find((g) => g.id === matrix.goodId);
    const newGood: IGood = {
      ...good,
      priceFsn: matrix.priceFsn,
      priceFso: matrix.priceFso,
      priceFsnSklad: matrix.priceFsnSklad,
      priceFsoSklad: matrix.priceFsoSklad,
    } as IGood;

    matrixGoods?.push(newGood);
  }
  return matrixGoods;
  // log('getRemGoodByContact', 'Окончание построения модели товаров по подразделению в разрезе штрихкодов');
};

const getGoodMatrixGood = (good: IGood, goodMatrix: IMatrixData) => {
  return {
    ...good,
    priceFsn: goodMatrix.priceFsn,
    priceFso: goodMatrix.priceFso,
    priceFsnSklad: goodMatrix.priceFsnSklad,
    priceFsoSklad: goodMatrix.priceFsoSklad,
  } as IGood;
};

export {
  getDateString,
  extraPredicate,
  isNamedEntity,
  getTimeProcess,
  twoDigits,
  // getGoodMatrixGoodListByContact,
  // getGoodMatrixByGoodId,
  getGoodMatrixGoodByContact,
  getGoodMatrixGood,
};
