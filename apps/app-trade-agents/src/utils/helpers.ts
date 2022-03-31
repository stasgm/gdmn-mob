import { INamedEntity } from '@lib/types';
import { log } from '@lib/mobile-app';

import { IGood, IGoodGroup, IMatrixData } from '../store/types';
import { IMGroup, IMGroupData, IMGroupModel } from '../store/app/types';

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
  goodMatrix: IMatrixData[],
  isRemains: boolean,
  groupId?: string,
): IGood[] => {
  log('getGoodMatrixGoodByContact', 'Начало построения модели матрицы товаров');

  const matrixGoods: IGood[] = [];
  if (isRemains) {
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
  } else {
    for (const good of goods) {
      if ((groupId && good?.goodgroup.id === groupId) || !groupId) {
        matrixGoods?.push(good);
      }
    }
  }
  log('getGoodMatrixGoodByContact', 'Окончание построения модели матрицы товаров');
  return matrixGoods;
};

// const getGroupModelByContact = (
//   groups: IGoodGroup[],
//   goods: IGood[],
//   goodMatrix: IMatrixData[] /*, isRemains: boolean | undefined = false*/,
// ) => {
//   // log('getRemGoodByContact', 'Начало построения модели товаров по подразделению в разрезе штрихкодов');

//   const parents: IMGroupModel = {};
//   for (const matrix of goodMatrix) {
//     const groupId = goods?.find((g) => g.id === matrix.goodId)?.goodgroup.id;
//     const parent = groups.find((gr) => gr.id === groupId)?.parent;
//     if (parent) {
//       if (!parents[parent.id]) {
//         const ch: IMGroup[] = [];
//         groups
//           .filter((gr) => gr.parent?.id === parent.id)
//           .forEach((gr) => {
//             const goodCount = getGoodMatrixGoodByContact(goods, goodMatrix, gr.id).length;
//             if (goodCount) {
//               ch.push({
//                 group: gr,
//                 goodCount: goodCount,
//               });
//             }
//           });
//         parents[parent.id] = {
//           parent,
//           children: ch,
//         };
//       }
//     }
//   }
//   return parents;
// };

// const getGoodMatrixGood = (good: IGood, goodMatrix: IMatrixData) => {
//   return {
//     ...good,
//     priceFsn: goodMatrix.priceFsn,
//     priceFso: goodMatrix.priceFso,
//     priceFsnSklad: goodMatrix.priceFsnSklad,
//     priceFsoSklad: goodMatrix.priceFsoSklad,
//   } as IGood;
// };

const getGroupModelByContact = (
  groups: IGoodGroup[],
  goods: IGood[],
  goodMatrix: IMatrixData[],
  isRemains: boolean,
) => {
  log('getGroupModelByContact', 'Начало построения модели матрицы');

  const matrixByGroup = goodMatrix.reduce(
    (p: IMGroupData<IMGroup>, { goodId, priceFsn, priceFso, priceFsnSklad, priceFsoSklad }) => {
      const good = goods?.find((g) => g.id === goodId);
      const group = groups?.find((gr) => gr.id === good?.goodgroup.id);
      if (good && group) {
        if (!p[group.id]) {
          p[group.id] = { group, goods: [{ ...good, priceFsn, priceFso, priceFsnSklad, priceFsoSklad }] };
        } else {
          p[group.id].goods?.push({ ...good, priceFsn, priceFso, priceFsnSklad, priceFsoSklad });
        }
      }
      return p;
    },
    {},
  );

  const parents: IMGroupModel = {};
  const mGroups = Object.values(matrixByGroup);

  for (const parent of groups.filter((gr) => !gr.parent?.id)) {
    const grps = mGroups.filter((gr) => gr.group.parent?.id === parent.id);
    if (grps.length) {
      parents[parent.id] = { parent, children: grps };
    }
  }
  log('getGroupModelByContact', 'Окончания построения модели матрицы');
  return parents;
};

export {
  getDateString,
  extraPredicate,
  isNamedEntity,
  getTimeProcess,
  twoDigits,
  getGoodMatrixGoodByContact,
  getGroupModelByContact,
};
