import { log } from '@lib/mobile-app';

import { IGood, IGoodGroup, IMatrixData } from '../store/types';
import { IMGroup, IMGroupData, IMGroupModel } from '../store/app/types';

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

export { getTimeProcess, twoDigits, getGoodMatrixGoodByContact, getGroupModelByContact };
