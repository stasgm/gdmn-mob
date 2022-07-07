import { log, round } from '@lib/mobile-app';

import {
  IGood,
  IGoodGroup,
  IMatrixData,
  IOrderDocument,
  IReturnDocument,
  IMGroup,
  IMGroupData,
  IMGroupModel,
  IOrderLine,
  IOrderTotalLine,
} from '../store/types';

import { UNKNOWN_GROUP } from './constants';

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

const getGoodMatrixByContact = (
  goods: IGood[],
  goodMatrix: IMatrixData[],
  isMatrix: boolean,
  groupId?: string,
): IGood[] => {
  log('getGoodMatrixByContact', 'Начало построения модели матрицы товаров');

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
  log('getGoodMatrixByContact', 'Окончание построения модели матрицы товаров');
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
                group: group.parent?.id ? group : ({ ...group, parent: UNKNOWN_GROUP } as IGoodGroup),
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
                group: group.parent?.id ? group : ({ ...group, parent: UNKNOWN_GROUP } as IGoodGroup),
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
    const p = gr.group.parent?.id ? gr.group.parent.id : UNKNOWN_GROUP.id;
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

const totalListByGroup = (
  firstLevelGroups: IGoodGroup[],
  groups: IGoodGroup[],
  orderLines: IOrderLine[],
): IOrderTotalLine[] =>
  firstLevelGroups
    ?.map((firstGr) => {
      // console.log('orderLines', orderLines);
      const linesByParentGroup = orderLines?.filter((l) =>
        groups.find(
          (group) => (group.parent?.id === firstGr.id || group.id === firstGr.id) && group.id === l.good.goodgroup.id,
        ),
      );

      const { quantity, s } = linesByParentGroup?.reduce(
        (prev: any, line) => {
          const sum = round((round(line.quantity, 3) / (line.good.invWeight || 1)) * line.good.priceFsn);
          return {
            quantity: prev.quantity + round(line.quantity, 3),
            s: prev.s + sum + round((sum * Number(line.good.vat || 0)) / 100),
          };
        },
        { quantity: 0, s: 0 },
      );

      return {
        group: {
          id: firstGr.id,
          name: firstGr.name,
        },
        quantity,
        s,
      };
    })
    .filter((i) => i.quantity > 0);

const totalList = (list: IOrderTotalLine[]) =>
  list?.reduce((prev, item) => ({ quantity: prev.quantity + (item.quantity || 0), s: prev.s + (item.s || 0) }), {
    quantity: 0,
    s: 0,
  });

export { getTimeProcess, twoDigits, getGoodMatrixByContact, getGroupModelByContact, totalListByGroup, totalList };
