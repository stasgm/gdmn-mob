import { log, round } from '@lib/mobile-hooks';

import {
  IMoveDocument,
  IFreeShipmentDocument,
  IShipmentDocument,
  barcodeSettings,
  ICell,
  ICellRef,
  IMoveLine,
  ICellName,
  IInventoryDocument,
  IShipmentLine,
} from '../store/types';
import {
  IBarcode,
  ICellData,
  IGood,
  IMGoodData,
  // IMGoodRemain,
  IModelData,
  IModelRem,
  IRemGood,
  IRemainsData,
} from '../store/app/types';

export const getNextDocNumber = (
  documents: IMoveDocument[] | IShipmentDocument[] | IFreeShipmentDocument[] | IInventoryDocument[],
) => {
  return (
    documents
      ?.map((item) => parseInt(item.number, 10))
      .reduce((newId, currId) => (newId > currId ? newId : currId), 0) + 1 || 1
  ).toString();
};

export const getBarcode = (barcode: string, settings: barcodeSettings) => {
  const weightLast = settings.countWeight;
  const dayLast = weightLast + settings.countDay;
  const monthLast = dayLast + settings.countMonth;
  const yearLast = monthLast + settings.countYear;
  const shcodeLast = yearLast + 4 + settings.countCode;
  const quantPackLast = shcodeLast + settings.countQuantPack + settings.countType;
  const numReceivedLast = quantPackLast + settings.countNumReceived;

  const weight = barcode.slice(0, weightLast);
  const day = barcode.slice(weightLast, dayLast);
  const month = barcode.slice(dayLast, monthLast);
  const year = '20' + barcode.slice(monthLast, yearLast);
  const shcode = barcode.slice(yearLast + 4, shcodeLast);
  const quantPack = barcode.slice(shcodeLast, quantPackLast);
  const numReceived = barcode.slice(quantPackLast, numReceivedLast);

  const workDate = new Date(Number(year), Number(month) - 1, Number(day)).toISOString();

  const barcodeObj: IBarcode = {
    barcode: barcode,
    weight: round(Number(weight) / 1000, 3),
    workDate,
    shcode: shcode,
    numReceived: numReceived,
    quantPack: Number(weight) < settings.boxWeight * 1000 ? 1 : Number(quantPack),
  };

  return barcodeObj;
};

const getLastMovingPos = (pos: ICellRef, lines: IMoveLine[]) => {
  const from = lines.find((i) => i.fromCell === pos.name);
  const to = lines.find((i) => i.toCell === pos.name);
  return { from, to };
};

export const getCellItem = (str: string) => {
  const cellArray = str.split('-');
  return { chamber: cellArray[0], row: cellArray[1], cell: cellArray[2] } as ICellName;
};

// Формирует модель с ячейками по подразделениям
export const getCellList = (list: ICellRef[], lines: IMoveLine[]) => {
  const model = list?.reduce((prev: IModelData, cur) => {
    const cellNameItem = getCellItem(cur.name);
    const cellItem: ICell = { ...cellNameItem, tier: cur.tier };

    const chamber = prev?.[cellItem?.chamber];

    const { from, to } = getLastMovingPos(cur, lines);

    const newCell: ICellData = {
      name: cur.name,
      cell: cellItem.cell,
      barcode: from ? '' : to ? to.barcode : cur.barcode || '',
      // barcode: cur.barcode || '',
      tier: cur.tier,
      disabled: cur.disabled || false,
      defaultGroup: cur.defaultGroup,
      sortOrder: cur.sortOrder,
    };

    if (!chamber) {
      prev[cellItem?.chamber] = {};

      prev[cellItem?.chamber][cellItem?.row] = {};
      prev[cellItem?.chamber][cellItem?.row][cellItem.tier] = [newCell];
    } else {
      const row = chamber[cellItem?.row];

      if (!row) {
        prev[cellItem?.chamber][cellItem?.row] = {};
        prev[cellItem?.chamber][cellItem?.row][cellItem.tier] = [newCell];
      } else {
        const tier = row[cellItem?.tier];

        if (!tier) {
          prev[cellItem?.chamber][cellItem?.row][cellItem?.tier] = [newCell];
        } else {
          prev[cellItem?.chamber][cellItem?.row][cellItem?.tier] = [
            ...prev[cellItem?.chamber][cellItem?.row][cellItem?.tier],
            newCell,
          ];
        }
      }
    }
    return prev;
  }, {});

  return model;
};

// Формирует справочник из модели с ячейками
export const getCellListRef = (model: IModelData) => {
  const list: ICellRef[] = Object.entries(model).reduce((prev: ICellRef[], curChamber) => {
    const chamberData = curChamber[1];
    const cellListByChamber = Object.entries(chamberData).reduce((listByChamber: ICellRef[], curRow) => {
      const rowData = curRow[1];

      const cellListByRow: ICellRef[] = Object.values(rowData).reduce((listByRow: ICellRef[], curCell) => {
        const cellInRow = curCell.map((i) => {
          const cell: ICellRef = {
            name: i.name,
            tier: i.tier,
            barcode: i.barcode,
            defaultGroup: i.defaultGroup,
            disabled: i.disabled,
            sortOrder: i.sortOrder,
          };
          return cell;
        });

        listByRow = [...listByRow, ...cellInRow];
        return listByRow;
      }, []);
      listByChamber = [...listByChamber, ...cellListByRow];
      return listByChamber;
    }, []);
    prev = [...prev, ...cellListByChamber];
    return prev;
  }, []);

  const sortedList = list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return sortedList;
};

export const jsonFormat = (str: any) => {
  return JSON.stringify(str, null, '\t');
};

// Возвращает новую дату со врменем 00:00:00
export const getNewDate = (date: string) => {
  const newDate = new Date(date);
  return new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()).toISOString();
};

//Возвращает суммарный вес товара в позициях документов
export const getTotalWeight = (good: IRemGood, docs: IShipmentDocument[]) => {
  const linesWeight = docs.reduce((prev, cur) => {
    const weight = cur.lines
      .filter((i) => i.good.id === good.good?.id)
      .reduce((sum, line) => {
        sum = sum + line.weight;
        return sum;
      }, 0);

    prev = prev + weight;
    return prev;
  }, 0);

  return linesWeight;
};

// Возвращает товар для добавления в позицию
export const getLineGood = (
  shcode: string,
  weight: number,
  goods: IGood[],
  goodRemains: IRemGood[],
  remainsUse: boolean,
) => {
  if (remainsUse && goodRemains.length) {
    const good = goodRemains.find((item) => item.good && `0000${item.good.shcode}`.slice(-4) === shcode);

    if (good) {
      const isRightWeight = good.remains >= weight;

      return {
        good: { id: good.good.id, name: good.good.name, shcode: good.good.shcode, isCattle: good.good.isCattle },
        isRightWeight,
      };
    } else {
      return { good: undefined, isRightWeight: false };
    }
  } else {
    const good = goods.find((item) => `0000${item.shcode}`.slice(-4) === shcode);
    return {
      good: good ? { id: good.id, name: good.name, shcode: good.shcode, isCattle: good.isCattle } : undefined,
      isRightWeight: true,
    };
  }
};

// const getRemGoodByContact = (goods: IGood[], remains: IRemainsData[] = []) => {
//   log('getRemGoodByContact', 'Начало построения модели товаров по подразделению в разрезе штрихкодов');
//   const remGoods: IMGoodData<IMGoodRemain> = {};

//   if (goods.length) {
//     if (remains.length) {
//       //Формируем объект остатков тмц
//       const remainsByGoodId = getRemainsByGoodId(remains);

//       //Заполняем объект товаров по штрихкоду, если есть шк и (выбор не из остатков или есть остатки по товару)
//       for (const good of goods) {
//         const shcode = good.shcode;
//         if (shcode && remainsByGoodId[good.id]) {
//           remGoods[shcode] = {
//             good,
//             remains: remainsByGoodId ? remainsByGoodId[good.id] : [],
//           };
//         }
//       }
//     }
//   }

//   log('getRemGoodByContact', 'Окончание построения модели товаров по подразделению в разрезе штрихкодов');
//   return remGoods;
// };

// export const getTotalWeight1 = (good: IModelRem, docs: IShipmentDocument[]) => {
//   const linesWeight = docs.reduce((prev, cur) => {
//     const weight = cur.lines
//       .filter((i) => i.good.id === good)
//       .reduce((sum, line) => {
//         sum = sum + line.weight;
//         return sum;
//       }, 0);

//     prev = prev + weight;
//     return prev;
//   }, 0);

//   return linesWeight;
// };

export const getTotalLines = (docsSubtraction: IShipmentLine[]) =>
  docsSubtraction.reduce((prev: IRemainsData[], cur) => {
    const index = prev.findIndex((i) => i.goodId === cur.good.id);
    if (index > -1) {
      prev[index] = { ...prev[index], q: prev[index].q + cur.weight };
    } else {
      prev = [...prev, { goodId: cur.good.id, q: cur.weight }];
    }
    return prev;
  }, []);

export const getRemGoodListByContact = (
  goods: IGood[],
  remains: IRemainsData[] = [],
  linesAddition: IRemainsData[] = [],
  linesSubtraction: IRemainsData[],
  // docsAddition: IShipmentDocument[]
) => {
  log('getRemGoodListByContact', 'Начало построения массива товаров по подразделению');

  const remGoods: IRemGood[] = [];
  if (goods.length) {
    //Если есть остатки, то формируем модель остатков по ид товара
    if (remains.length) {
      //Формируем объект остатков тмц
      const remainsByGoodId = getRemainsByGoodId(remains, linesAddition, linesSubtraction);

      //Формируем массив товаров, добавив свойство цены и остатка
      //Если по товару нет остатков и если модель не для выбора из справочника тмц, (не из остатков)
      //то добавляем запись с нулевыми значениями цены и остатка
      for (const good of goods) {
        const goodAdd = linesAddition.find((i) => i.goodId === good.id);

        if (remainsByGoodId && remainsByGoodId[good.id]) {
          for (const r of remainsByGoodId[good.id]) {
            //Если isRemains true, showZeroRemains false и "isControlRemains" true, то в модель такие товары не добавляем
            if (r.q !== 0) {
              remGoods.push({
                good,
                remains: r.q,
              });
            }
          }
        } else if (remainsByGoodId && goodAdd) {
          const qSubstr = linesSubtraction?.find((i) => i.goodId === good.id)?.q || 0;
          const newRemains = goodAdd.q - qSubstr;
          if (newRemains !== 0) {
            remGoods.push({
              good,
              remains: newRemains,
            });
          }
        }
      }
    }
  }

  log('getRemGoodListByContact', 'Окончание построения массива товаров по подразделению');
  return remGoods;
};

//Возвращает объект остатков тмц, пример: {"1": [{ price: 1.2, q: 1 }, { price: 1.3, q: 2 }]}
const getRemainsByGoodId = (
  remains: IRemainsData[],
  linesAddition: IRemainsData[] = [],
  linesSubtraction: IRemainsData[] = [],
) => {
  return remains.reduce((p: IMGoodData<IModelRem[]>, { goodId, q = 0 }: IRemainsData) => {
    const x = p[goodId];
    const qAdd = linesAddition?.find((i) => i.goodId === goodId)?.q || 0;
    const qSubstr = linesSubtraction?.find((i) => i.goodId === goodId)?.q || 0;

    const newQ = q + qAdd - qSubstr;
    if (newQ !== 0) {
      if (!x) {
        p[goodId] = [{ q: newQ }];
      } else {
        x.push({ q: newQ });
      }
    }
    return p;
  }, {});
};
