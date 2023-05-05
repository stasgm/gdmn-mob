import {
  IMoveDocument,
  IFreeShipmentDocument,
  IShipmentDocument,
  barcodeSettings,
  ICellMovementDocument,
  ICell,
  ICellRef,
  IMoveLine,
  ICellName,
  IInventoryDocument,
} from '../store/types';
import { IBarcode, ICellData, IModelData } from '../store/app/types';

export const getNextDocNumber = (
  documents:
    | IMoveDocument[]
    | IShipmentDocument[]
    | IFreeShipmentDocument[]
    | ICellMovementDocument[]
    | IInventoryDocument[],
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
    weight: Number(weight) / 1000,
    workDate,
    shcode: shcode,
    numReceived: numReceived,
    quantPack: Number(quantPack),
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

export const getCellList = (list: ICellRef[], lines: IMoveLine[]) => {
  console.log('getCellList');
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

export const jsonFormat = (str: any) => {
  return JSON.stringify(str, null, '\t');
};
