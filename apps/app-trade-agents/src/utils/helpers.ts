import { log, round } from '@lib/mobile-hooks';

import {
  IGood,
  IGoodGroup,
  IMatrixData,
  IOrderDocument,
  IMGroup,
  IMGroupData,
  IMGroupModel,
  IOrderLine,
  IOrderTotalLine,
  IRemGood,
  IRemainsData,
  IMGoodData,
  IModelRem,
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

export const getNextDocNumber = (documents?: IOrderDocument[]) => {
  return (
    (documents
      ?.map((item) => parseInt(item.number, 10))
      ?.reduce((newId, currId) => (newId > currId ? newId : currId), 0) || 0) + 1 || 1
  ).toString();
};

const getGoodMatrixByContact = (
  goods: IGood[],
  goodMatrix: IMatrixData[],
  isMatrix: boolean,
  groupId?: string,
  filterText?: string,
): IGood[] => {
  log('getGoodMatrixByContact', 'Начало построения модели матрицы товаров');
  const filterTextUpper = filterText?.toUpperCase();
  const matrixGoods: IGood[] = [];
  if (isMatrix && goodMatrix) {
    for (const matrix of goodMatrix) {
      const good = goods?.find((g) => g.id === matrix.goodId);
      if (
        ((groupId && good?.goodgroup.id === groupId) || !groupId) &&
        (!filterTextUpper || good?.name.toUpperCase().includes(filterTextUpper))
      ) {
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
      if (
        ((groupId && good?.goodgroup.id === groupId) || !groupId) &&
        (!filterTextUpper || good?.name.toUpperCase().includes(filterTextUpper))
      ) {
        matrixGoods?.push(good);
      }
    }
  }
  log('getGoodMatrixByContact', 'Окончание построения модели матрицы товаров');
  return matrixGoods;
};
/**Формирует модель товаров в разрезе родительских групп*/
const getGroupModelByContact = (
  groups: IGoodGroup[],
  goods: IGood[],
  goodMatrix: IMatrixData[],
  isMatrix: boolean,
  prevLines: IOrderLine[] = [],
  filterText?: string,
) => {
  log('getGroupModelByContact', 'Начало построения модели матрицы');
  const filterTextUpper = filterText?.toUpperCase();
  // Если установлен признак Использовать матрицы, то берем товары только из матриц,
  // иначе - берем все товары
  // Далее группируем товары по группам
  // Если группа не имеет роидтеля, подставляем фиктивную группу 'Другое'
  // Пример {'groupId1':{ group: {id: '11', name: 'Группа1', parent: {id: '1', name: 'Группа родительская1'}},goods: []}},
  //         'groupId2':{ group: {id: '22', name: 'Группа2', parent: {id: '2', name: 'Группа родительская2'}}, goods: []}}}
  const matrixByGroup =
    isMatrix && goodMatrix
      ? (prevLines.length
          ? goodMatrix.filter((g) => prevLines.some((p) => p.good.id === g.goodId))
          : goodMatrix
        ).reduce((p: IMGroupData<IMGroup>, { goodId, priceFsn, priceFso, priceFsnSklad, priceFsoSklad }) => {
          const good = goods?.find((g) => g.id === goodId);
          const group = groups?.find((gr) => gr.id === good?.goodgroup.id);
          if (good && group && (!filterTextUpper || group.name.toUpperCase().includes(filterTextUpper))) {
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
      : (prevLines.length ? goods.filter((g) => prevLines.some((p) => p.good.id === g.id)) : goods).reduce(
          (p: IMGroupData<IMGroup>, good: IGood) => {
            if (!p[good.goodgroup.id]) {
              const group = groups.find((gr) => gr.id === good.goodgroup.id);
              if (group && (!filterTextUpper || group.name.toUpperCase().includes(filterTextUpper))) {
                p[good.goodgroup.id] = {
                  group: group.parent?.id ? group : ({ ...group, parent: UNKNOWN_GROUP } as IGoodGroup),
                  goods: [good],
                };
              }
            } else {
              p[good.goodgroup.id].goods?.push(good);
            }

            return p;
          },
          {},
        );

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
      const linesByParentGroup =
        orderLines?.filter((l) =>
          groups.find(
            (group) => (group.parent?.id === firstGr.id || group.id === firstGr.id) && group.id === l.good.goodgroup.id,
          ),
        ) || [];

      const { quantity, sum, sumVat } = linesByParentGroup.reduce(
        (prev: any, line) => {
          const s1 = round((round(line.quantity, 3) / (line.good.invWeight || 1)) * line.good.priceFsn);
          return {
            quantity: prev.quantity + round(line.quantity, 3),
            sum: prev.sum + s1,
            sumVat: prev.sumVat + s1 + round((s1 * Number(line.good.vat || 0)) / 100, 3),
          };
        },
        { quantity: 0, sum: 0, sumVat: 0 },
      );

      return {
        group: {
          id: firstGr.id,
          name: firstGr.name,
        },
        quantity,
        sum,
        sumVat,
      };
    })
    .filter((i) => i.quantity > 0);

const totalList = (list: IOrderTotalLine[]) =>
  list?.reduce(
    (prev, item) => ({
      quantity: prev.quantity + (item.quantity || 0),
      sum: prev.sum + (item.sum || 0),
      sumVat: prev.sumVat + (item.sumVat || 0),
    }),
    {
      quantity: 0,
      sum: 0,
      sumVat: 0,
    },
  );

const getItemLayout = (index: number, height: number) => ({
  length: height,
  offset: height * index,
  index,
});

const viewabilityConfig = {
  itemVisiblePercentThreshold: 50,
};

const jsonFormat = (str: any) => {
  return JSON.stringify(str, null, '\t');
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
                priceFsn: good.priceFsn,
                priceFsnSklad: good.priceFsn,
                priceFso: good.priceFso,
                priceFsoSklad: good.priceFsoSklad,
                remains: r.q,
              });
            }
          }
        } else if (!isRemains) {
          remGoods.push({
            good,
            priceFsn: good.priceFsn,
            priceFsnSklad: good.priceFsn,
            priceFso: good.priceFso,
            priceFsoSklad: good.priceFsoSklad,
            remains: 0,
          });
        }
      }
    } else if (!isRemains) {
      //Если по контакту нет остатков и выбор не из остатков, добавляем объект товара c 0
      for (const good of goods) {
        remGoods.push({ good, priceFsn: 0, priceFsnSklad: 0, priceFso: 0, priceFsoSklad: 0, remains: 0 });
      }
    }
  }

  log('getRemGoodListByContact', 'Окончание построения массива товаров по подразделению');
  return remGoods;
};

//Возвращает объект остатков тмц, пример: {"1": [{ price: 1.2, q: 1 }, { price: 1.3, q: 2 }]}
const getRemainsByGoodId = (remains: IRemainsData[], noZeroRemains = false) => {
  return remains.reduce(
    (
      p: IMGoodData<IModelRem[]>,
      { goodId, priceFsn = 0, priceFsnSklad = 0, priceFso = 0, priceFsoSklad = 0, q = 0 }: IRemainsData,
    ) => {
      const x = p[goodId];
      if (!noZeroRemains || q !== 0) {
        if (!x) {
          p[goodId] = [{ priceFsn, priceFsnSklad, priceFso, priceFsoSklad, q }];
        } else {
          x.push({ priceFsn, priceFsnSklad, priceFso, priceFsoSklad, q });
        }
      }
      return p;
    },
    {},
  );
};

export {
  getTimeProcess,
  twoDigits,
  getGoodMatrixByContact,
  getGroupModelByContact,
  totalListByGroup,
  totalList,
  getItemLayout,
  viewabilityConfig,
  jsonFormat,
  getRemGoodListByContact,
};
