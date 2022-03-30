import { addAbortSignal } from 'stream';

import { INamedEntity } from '@lib/types';
import { log } from '@lib/mobile-app';

import { IGood, IGoodGroup, IMatrixData } from '../store/types';
import { IMGroup, IMGroupModel } from '../store/app/types';

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

const getGoodMatrixGoodByContact = (
  goods: IGood[],
  goodMatrix: IMatrixData[] /*, isRemains: boolean | undefined = false*/,
  groupId?: string,
): IGood[] => {
  // log('getRemGoodByContact', 'Начало построения модели товаров по подразделению в разрезе штрихкодов');

  const matrixGoods: IGood[] = [];
  for (const matrix of goodMatrix) {
    const good = goods?.find((g) => g.id === matrix.goodId);
    if ((groupId && good?.goodgroup.id === groupId) || !groupId) {
      const newGood: IGood = {
        ...good,
        priceFsn: matrix.priceFsn,
        priceFso: matrix.priceFso,
        priceFsnSklad: matrix.priceFsnSklad,
        priceFsoSklad: matrix.priceFsoSklad,
      } as IGood;

      matrixGoods?.push(newGood);
    }
  }
  return matrixGoods;
  // log('getRemGoodByContact', 'Окончание построения модели товаров по подразделению в разрезе штрихкодов');
};

const getGroupModelByContact = (
  groups: IGoodGroup[],
  goods: IGood[],
  goodMatrix: IMatrixData[] /*, isRemains: boolean | undefined = false*/,
) => {
  // log('getRemGoodByContact', 'Начало построения модели товаров по подразделению в разрезе штрихкодов');

  const parents: IMGroupModel = {};
  for (const matrix of goodMatrix) {
    const good = goods?.find((g) => g.id === matrix.goodId);
    const parent = groups.find((gr) => gr.id === good?.goodgroup.id)?.parent;
    if (parent) {
      if (!parents[parent.id]) {
        const ch: IMGroup[] = [];
        groups
          .filter((gr) => gr.parent?.id === parent.id)
          .forEach((gr) => {
            const goodCount = getGoodMatrixGoodByContact(goods, goodMatrix, gr.id).length;
            if (goodCount) {
              ch.push({
                group: gr,
                goodCount: goodCount,
              });
            }
          });
        parents[parent.id] = {
          parent,
          children: ch,
        };
      }
    }
  }
  return parents;
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
  getGroupModelByContact,
};
