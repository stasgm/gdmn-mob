import { IMoveDocument, IFreeShipmentDocument, IShipmentDocument, barcodeSettings } from '../store/types';
import { IBarcode } from '../store/app/types';

export const getNextDocNumber = (documents: IMoveDocument[] | IShipmentDocument[] | IFreeShipmentDocument[]) => {
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
  const quantPackLast = shcodeLast + settings.countQuantPack;
  const numReceivedLast = quantPackLast + settings.countType + settings.countNumReceived;

  const weight = barcode.slice(0, weightLast);
  const day = barcode.slice(weightLast, dayLast);
  const month = barcode.slice(dayLast, monthLast);
  const year = '20' + barcode.slice(monthLast, yearLast);
  const shcode = barcode.slice(yearLast + 4, shcodeLast);
  const quantPack = barcode.slice(shcodeLast, quantPackLast);
  const numReceived = barcode.slice(quantPackLast + 1, numReceivedLast);

  const date = new Date(Number(year), Number(month) - 1, Number(day)).toISOString();

  const barcodeObj: IBarcode = {
    barcode: barcode,
    weight: Number(weight) / 1000,
    workDate: date,
    shcode: shcode,
    numReceived: numReceived,
    quantPack: Number(quantPack),
  };

  return barcodeObj;
};
