import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { INamedEntity, IEntity, IDocument, MandateProps, IHead, StatusType, IReferenceData } from '@lib/types';
import { IFormParam } from '@lib/store';

import { IAddressStoreEntity, ICodeEntity, IGood } from './app/types';

export { ITempLine, ITempDocument } from './app/types';

export interface IMoveFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  status?: StatusType;
  fromDepart?: IAddressStoreEntity;
  toDepart?: IAddressStoreEntity;
  comment?: string;
  documentSubtype?: INamedEntity;
}

export interface IShipmentFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  status?: StatusType;
  comment?: string;
  depart?: ICodeEntity;
}

export interface IFreeShipmentFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  status?: StatusType;
  depart?: ICodeEntity;
  comment?: string;
}

export interface IInventoryFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  status?: StatusType;
  contact?: ICodeEntity;
  outlet?: ICodeEntity;
  toDepart?: ICodeEntity;
  comment?: string;
}

export interface ICellMovementFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  status?: StatusType;
  depart?: IAddressStoreEntity;
  comment?: string;
}

export interface ILaboratoryFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  status?: StatusType;
  depart?: ICodeEntity;
  comment?: string;
}

export interface IReturnFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  status?: StatusType;
  depart?: ICodeEntity;
  comment?: string;
}

//Подразделения-склады
export type Department = INamedEntity;
export type DepartmentType = INamedEntity;

export interface IContact extends INamedEntity, IReferenceData {
  contractNumber: string; // Номер договора
  contractDate: string; // Дата договора
  paycond: string; // Условие оплаты
  phoneNumber: string; // Номер телефона
}

export interface ICellName {
  chamber: string;
  row: string;
  cell: string;
}

export interface ICell extends ICellName {
  tier: string;
}

export interface ICellRef {
  name: string;
  tier: string;
  barcode?: string;
  disabled?: boolean;
  defaultGroup?: INamedEntity;
  sortOrder?: number;
}
export interface IMoveHead extends IHead {
  fromDepart: IAddressStoreEntity;
  toDepart: IAddressStoreEntity; //Подразделение
  subtype: INamedEntity; //Подтип документа
  comment?: string; // Комvентарий
}

export interface IMoveLine extends IEntity {
  good: IGood;
  weight: number;
  workDate: string; // Дата производства
  numReceived: string; // Номер партии
  quantPack: number; // порядковый номер сканирования в документе
  barcode?: string; // технологический код
  sortOrder?: number; // порядок сортировки
  fromCell?: string; // номер ячейки
  toCell?: string; // номер ячейки
}

export type IMoveDocument = MandateProps<IDocument<IMoveHead, IMoveLine>, 'head' | 'lines'>;

export interface IOrderHead extends IHead {
  contact: ICodeEntity; //организация-плательщик
  outlet: ICodeEntity; // магазин –подразделение организации плательщика
  onDate: string; //  Дата отгрузки
  barcode: string;
}

export interface IOrderLine extends IEntity {
  good: IGood;
  weight: number;
  packagekey?: INamedEntity; // Вид упаковки
}

export type IOrderDocument = MandateProps<IDocument<IOrderHead, IOrderLine>, 'head' | 'lines'>;

export interface IShipmentHead extends IHead {
  contact: ICodeEntity; //организация-плательщик
  outlet: ICodeEntity; // магазин –подразделение организации плательщика
  depart: IAddressStoreEntity; // подразделение сотрудника (кладовщик, работающий с терминалом)
  onDate: string; // Дата отгрузки
  barcode: string; // штрих-код заявки, по которой создан
  // ovСode?: string; // штрих-код документа-отвеса
  orderId: string;
}

export interface IShipmentLine extends IEntity {
  good: IGood; // товар
  weight: number; //вес
  workDate: string; // Дата производства
  numReceived: string; // Номер партии
  barcode: string; // технологический код
  quantPack: number; // порядковый номер сканирования в документе
  sortOrder?: number; // порядок сортировки
  scannedBarcode?: string;
}

export type IShipmentDocument = MandateProps<IDocument<IShipmentHead, IShipmentLine>, 'head' | 'lines'>;

export interface IFreeShipmentHead extends IHead {
  depart: ICodeEntity;
  comment?: string; // Коментарий
}
export interface IFreeShipmentLine extends IEntity {
  good: IGood;
  weight: number;
  workDate: string; // Дата производства
  numReceived: string; // Номер партии
  barcode?: string; // технологический код
  sortOrder?: number; // порядок сортировки
  scannedBarcode?: string;
  quantPack: number; // порядковый номер сканирования в документе
  isCattle?: number;
}
export type IFreeShipmentDocument = MandateProps<IDocument<IFreeShipmentHead, IFreeShipmentLine>, 'head' | 'lines'>;

export interface IInventoryHead extends IHead {
  toDepart: IAddressStoreEntity;
  comment?: string; // Комvентарий
}

export interface IInventoryLine extends IEntity {
  good: IGood;
  weight: number;
  workDate: string; // Дата производства
  numReceived: string; // Номер партии
  barcode?: string; // технологический код
  sortOrder?: number; // порядок сортировки
  // fromCell?: string; // номер ячейки
  toCell?: string; // номер ячейки
  quantPack: number; // порядковый номер сканирования в документе
}

export type IInventoryDocument = MandateProps<IDocument<IInventoryHead, IInventoryLine>, 'head' | 'lines'>;
export interface ICellMovementHead extends IHead {
  depart: IAddressStoreEntity;
  comment?: string; // Коментарий
}
export interface CellMovementLine extends IEntity {
  barcode: string; // технологический код
  fromCell: string;
  toCell: string;
}

export type ICellMovementDocument = MandateProps<IDocument<ICellMovementHead, CellMovementLine>, 'head' | 'lines'>;

export interface ILaboratoryHead extends IHead {
  depart: ICodeEntity;
  comment?: string; // Коментарий
}
export interface ILaboratoryLine extends IEntity {
  good: IGood;
  weight: number;
  workDate: string; // Дата производства
  numReceived: string; // Номер партии
  barcode?: string; // технологический код
  sortOrder?: number; // порядок сортировки
  scannedBarcode?: string;
  quantPack: number; // порядковый номер сканирования в документе
}

export type ILaboratoryDocument = MandateProps<IDocument<ILaboratoryHead, ILaboratoryLine>, 'head' | 'lines'>;

export interface IReturnHead extends IHead {
  depart: ICodeEntity;
  comment?: string; // Коментарий
}
export interface IReturnLine extends IEntity {
  good: IGood;
  weight: number;
  workDate: string; // Дата производства
  numReceived: string; // Номер партии
  barcode?: string; // технологический код
  sortOrder?: number; // порядок сортировки
  scannedBarcode?: string;
  quantPack: number; // порядковый номер сканирования в документе
}
export type IReturnDocument = MandateProps<IDocument<IReturnHead, IReturnLine>, 'head' | 'lines'>;

export type barcodeSettings = {
  [name: string]: number;
};

export interface IOutlet extends INamedEntity, IReferenceData {
  company: INamedEntity; //организация-плательщик
  address: string; //Адрес разгрузки
  phoneNumber: string; // Номер телефона
  lat: number; // широта
  lon: number; // долгота
}

export type TakeOrderType = 'ON_PLACE' | 'BY_PHONE' | 'BY_EMAIL';

export type AppThunk<ReturnType = void, S = void, A extends AnyAction = AnyAction> = ThunkAction<
  ReturnType,
  S,
  unknown,
  A
>;
