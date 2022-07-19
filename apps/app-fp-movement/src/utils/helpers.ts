import { IMoveDocument, ITempDocument } from '../store/types';
import { IBarcode } from '../store/app/types';

export const getNextDocNumber = (documents: IMoveDocument[] | ITempDocument[]) => {
  return (
    documents
      ?.map((item) => parseInt(item.number, 10))
      .reduce((newId, currId) => (newId > currId ? newId : currId), 0) + 1 || 1
  ).toString();
};

export const getBarcode = (barcode: string) => {
  const weight = barcode.slice(0, 6);
  const day = barcode.slice(6, 8);
  const month = barcode.slice(8, 10);
  const year = '20' + barcode.slice(10, 12);
  // const hours = barcode.slice(12, 14);
  // const minutes = barcode.slice(14, 16);
  const shcode = barcode.slice(16, 20);
  const quantPack = barcode.slice(16, 20);
  const numReceived = barcode.slice(24, 30);

  const date = new Date(Number(year), Number(month) - 1, Number(day)).toISOString();

  const barcodeObj: IBarcode = {
    barcode: barcode,
    weight: Number(weight) / 1000,
    workDate: date,
    shcode: shcode,
    numReceived: numReceived,
    quantPack: Number(quantPack),
  };

  // console.log('w', barcodeObj);
  return barcodeObj;
};
