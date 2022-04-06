import { log } from '@lib/mobile-app';

import {
  IGood,
  IGoodGroup,
  IMatrixData,
  IOrderDocument,
  IReturnDocument,
  IMGroup,
  IMGroupData,
  IMGroupModel,
} from '../store/types';

import { unknownGroup } from './constants';

const getTimeProcess = (db: string, de?: string) => {
  const diffMinutes = Math.floor(((de ? Date.parse(de) : Date.now()) - Date.parse(db)) / 60000);
  const hour = Math.floor(diffMinutes / 60);
  return `${hour} часов ${diffMinutes - hour * 60} минут`;
};

const twoDigits = (value: number) => {
  return value >= 10 ? value : `0${value}`;
};

export const getNextDocNumber = (documents: IOrderDocument[] | IReturnDocument[]) => {
  return (
    documents
      ?.map((item) => parseInt(item.number, 10))
      .reduce((newId, currId) => (newId > currId ? newId : currId), 0) + 1 || 1
  ).toString();
};

const getGoodMatrixGoodByContact = (
  goods: IGood[],
  goodMatrix: IMatrixData[],
  isMatrix: boolean,
  groupId?: string,
): IGood[] => {
  log('getGoodMatrixGoodByContact', 'Начало построения модели матрицы товаров');

  const matrixGoods: IGood[] = [];
  if (isMatrix && goodMatrix) {
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
/**Формирует модель товаров в разрезе родительских групп*/
const getGroupModelByContact = (groups: IGoodGroup[], goods: IGood[], goodMatrix: IMatrixData[], isMatrix: boolean) => {
  log('getGroupModelByContact', 'Начало построения модели матрицы');
  // Если установлен признак Использовать матрицы, то берем товары только из матриц,
  // иначе - берем все товары
  // Далее группируем товары по группам
  // Если группа не имеет роидтеля, подставляем фиктивную группу 'Другое'
  // Пример {'groupId1':{ group: {id: '11', name: 'Группа1', parent: {id: '1', name: 'Группа родительская1'}},goods: []}},
  //         'groupId2':{ group: {id: '22', name: 'Группа2', parent: {id: '2', name: 'Группа родительская2'}}, goods: []}}}
  const matrixByGroup =
    isMatrix && goodMatrix
      ? goodMatrix.reduce((p: IMGroupData<IMGroup>, { goodId, priceFsn, priceFso, priceFsnSklad, priceFsoSklad }) => {
          const good = goods?.find((g) => g.id === goodId);
          const group = groups?.find((gr) => gr.id === good?.goodgroup.id);
          if (good && group) {
            if (!p[group.id]) {
              p[group.id] = {
                group: group.parent?.id ? group : ({ ...group, parent: unknownGroup } as IGoodGroup),
                goods: [{ ...good, priceFsn, priceFso, priceFsnSklad, priceFsoSklad }],
              };
            } else {
              p[group.id].goods?.push({ ...good, priceFsn, priceFso, priceFsnSklad, priceFsoSklad });
            }
          }
          return p;
        }, {})
      : goods.reduce((p: IMGroupData<IMGroup>, good: IGood) => {
          if (!p[good.goodgroup.id]) {
            const group = groups.find((gr) => gr.id === good.goodgroup.id);
            if (group) {
              p[good.goodgroup.id] = {
                group: group.parent?.id ? group : ({ ...group, parent: unknownGroup } as IGoodGroup),
                goods: [good],
              };
            }
          } else {
            p[good.goodgroup.id].goods?.push(good);
          }
          return p;
        }, {});

  const parents: IMGroupModel = {};
  const mGroups = Object.values(matrixByGroup);
  //Пробегаем по всем группам и разносим их по родительским
  // Пример {'parentGroup1': { parent: {}, children: [{'groupId1':{ group: {id: '11', name: 'Группа1', parent: {id: '1', name: 'Группа родительская1'}},goods: []}},
  //         'groupId2':{ group: {id: '22', name: 'Группа2', parent: {id: '2', name: 'Группа родительская2'}}, goods: []}}}]}
  for (const gr of mGroups) {
    const p = gr.group.parent?.id ? gr.group.parent.id : unknownGroup.id;
    if (p) {
      if (parents[p]) {
        parents[p].children?.push(gr);
      } else {
        const parentGr = groups.find((parent) => p === parent.id);
        if (parentGr) {
          parents[parentGr.id] = { parent: parentGr, children: [gr] };
        }
      }
    }
  }

  log('getGroupModelByContact', 'Окончания построения модели матрицы');
  return parents;
};

export { getTimeProcess, twoDigits, getGoodMatrixGoodByContact, getGroupModelByContact };
