import { isNumeric, log, round } from '@lib/mobile-hooks';

import { Alert } from 'react-native';

import { Audio } from 'expo-av';

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
} from '../store/types';
import {
  IBarcode,
  ICellData,
  IGood,
  IGoodQuantity,
  IMGoodData,
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
  const timeLast = yearLast + 4;
  const shcodeLast = timeLast + settings.countCode;
  const quantPackLast = shcodeLast + settings.countQuantPack;
  const numReceivedLast = quantPackLast + settings.countNumReceived;

  const weight = barcode.slice(0, weightLast);
  const day = barcode.slice(weightLast, dayLast);
  const month = barcode.slice(dayLast, monthLast);
  const year = '20' + barcode.slice(monthLast, yearLast);
  const shcode = barcode.slice(yearLast + 4, shcodeLast);
  const quantPack = barcode.slice(shcodeLast, quantPackLast);
  const numReceived = barcode.slice(quantPackLast, numReceivedLast);

  const time = barcode.slice(yearLast, timeLast);

  const workDate = new Date(Number(year), Number(month) - 1, Number(day)).toISOString();

  const barcodeObj: IBarcode = {
    barcode: barcode,
    weight: round(Number(weight) / 1000, 3),
    workDate,
    shcode: shcode,
    numReceived: numReceived,
    quantPack: Number(weight) < settings.boxWeight * 1000 ? 1 : Number(quantPack),
    time,
  };

  return barcodeObj;
};

export const getBarcodeString = (barcodeObj: IBarcode) => {
  const day = `00${new Date(barcodeObj.workDate).getDate().toLocaleString()}`.slice(-2);
  const month = `00${(new Date(barcodeObj.workDate).getMonth() + 1).toLocaleString()}`.slice(-2);
  const year = `00${new Date(barcodeObj.workDate).getFullYear().toLocaleString().slice(2)}`.slice(-2);

  const shcode = `0000${barcodeObj.shcode}`.slice(-4);
  const quantPack = `0000${barcodeObj.quantPack.toLocaleString()}`.slice(-4);

  const weight = `000000${round(barcodeObj.weight * 1000, 3).toLocaleString()}`.slice(-6);

  const barcode =
    weight + day + month + year + (barcodeObj.time || '0000') + shcode + quantPack + barcodeObj.numReceived;

  return barcode;
};

export const getLastMovingPos = (pos: ICellRef, lines: IMoveLine[]) => {
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
  if (remainsUse) {
    if (goodRemains.length) {
      const good = goodRemains.find((item) => item.good && `0000${item.good.shcode}`.slice(-4) === shcode);

      if (good) {
        const isRightWeight = good.remains >= weight;

        return {
          good: {
            id: good.good.id,
            name: good.good.name,
            shcode: good.good.shcode,
            isCattle: good.good.isCattle,
            goodGroupId: good.good.goodGroupId,
          },
          isRightWeight,
        };
      } else {
        return { good: undefined, isRightWeight: false };
      }
    } else {
      return { good: undefined, isRightWeight: false };
    }
  } else {
    const good = goods.find((item) => `0000${item.shcode}`.slice(-4) === shcode);
    return {
      good: good
        ? { id: good.id, name: good.name, shcode: good.shcode, isCattle: good.isCattle, goodGroupId: good.goodGroupId }
        : undefined,
      isRightWeight: true,
    };
  }
};

export const getTotalLines = (docList: IShipmentDocument[], departId: string) =>
  docList.reduce((prev: IGoodQuantity, cur) => {
    const isAdd = cur?.head?.toDepart?.id === departId;
    const isSubtr = cur?.head?.fromDepart?.id === departId;
    if (
      cur.documentType?.name !== 'order' &&
      cur.documentType?.name !== 'inventory' &&
      cur.documentType?.name !== 'return' &&
      cur.status !== 'PROCESSED' &&
      (isAdd || isSubtr)
    ) {
      cur.lines.forEach((line) => {
        const good = prev[line.good.id];

        const quantity = isAdd ? line.weight : -line.weight;

        if (good) {
          prev[line.good.id] = prev[line.good.id] + quantity;
        } else {
          prev[line.good.id] = quantity;
        }
      });
    }

    return prev;
  }, {});

// export const fuck = (quantity: number, line: IShipmentLine) => {
//   const weight = round(line?.weight * quantity, 3);

//   const newLine: IShipmentLine = {
//     ...line,
//     quantPack: quantity,
//     weight,
//     scannedBarcode: line?.barcode,
//   };

// };

export const getRemGoodListByContact = (
  goods: IGood[],
  remains: IRemainsData[] = [],
  docList: IShipmentDocument[] = [],
  departId: string,
) => {
  log('getRemGoodListByContact', 'Начало построения массива товаров по подразделению');

  const remGoods: IRemGood[] = [];
  if (goods.length) {
    //Если есть остатки, то формируем модель остатков по ид товара
    if (remains.length) {
      //Формируем объект остатков тмц
      const linesQuantity = getTotalLines(docList, departId) || undefined;

      const remainsByGoodId = getRemainsByGoodId(remains, linesQuantity);

      //Формируем массив товаров, добавив свойствоостатка
      //Если по товару нет остатков и если модель не для выбора из справочника тмц, (не из остатков)
      //то добавляем запись с нулевыми значениями остатка
      for (const good of goods) {
        if (remainsByGoodId && remainsByGoodId[good.id]) {
          for (const r of remainsByGoodId[good.id]) {
            //Если isRemains true, то в модель такие товары не добавляем
            if (r.q !== 0) {
              remGoods.push({
                good,
                remains: r.q,
              });
            }
          }
        } else if (
          remainsByGoodId &&
          linesQuantity &&
          isNumeric(linesQuantity[good.id]) &&
          linesQuantity[good.id] !== 0
        ) {
          remGoods.push({
            good,
            remains: linesQuantity[good.id],
          });
        }
      }
    }
  }

  log('getRemGoodListByContact', 'Окончание построения массива товаров по подразделению');
  return remGoods;
};

//Возвращает объект остатков тмц, пример: {"1": [{ q: 1 }, { q: 2 }]}
const getRemainsByGoodId = (remains: IRemainsData[], linesQuantity: IGoodQuantity) => {
  return remains.reduce((p: IMGoodData<IModelRem[]>, { goodId, q = 0 }: IRemainsData) => {
    const x = p[goodId];
    const goodQ = linesQuantity[goodId] || 0;

    const newQ = q + goodQ;
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

export const alertWithSound = (label: string, text: string) => {
  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require('../../assets/error.wav'));
    await sound.playAsync();
  };

  playSound();
  Alert.alert(label, text, [{ text: 'OK' }]);
};

export const alertWithSoundMulti = (label: string, text: string, onOk: () => void) => {
  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require('../../assets/error.wav'));
    await sound.playAsync();
  };

  playSound();

  Alert.alert(`${label}`, `${text}`, [
    {
      text: 'Отмена',
    },
    {
      text: 'Да',
      onPress: () => onOk(),
    },
  ]);
};
