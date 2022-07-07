import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import {
  StatusType,
  IEntity,
  IDocument,
  MandateProps,
  IHead,
  IReferenceData,
  IDocumentType,
  INamedEntity,
} from '@lib/types';

import { ICoords } from './geo/types';
import { IGood } from './app/types';

export * from './app/types';

export interface IFormParam {
  [fieldName: string]: unknown;
}

export interface IOrderFormParam extends IFormParam {
  contact?: IReferenceData;
  outlet?: IReferenceData;
  depart?: IReferenceData;
  number?: string;
  documentDate?: string;
  onDate?: string;
  status?: StatusType;
  route?: IReferenceData;
  comment?: string;
}

export interface IReturnFormParam extends IFormParam {
  contact?: IReferenceData;
  outlet?: IReferenceData;
  number?: string;
  documentDate?: string;
  depart?: IReferenceData;
  reason?: string;
  route?: IReferenceData;
  status?: StatusType;
}

export interface ISellBillFormParam extends IFormParam {
  dateBegin?: string;
  dateEnd?: string;
  good?: INamedEntity;
}

//Организации
export interface IContact extends INamedEntity, IReferenceData {
  contractNumber: string; // Номер договора
  contractDate: string; // Дата договора
  paycond: string; // Условие оплаты
  phoneNumber: string; // Номер телефона
}
//Магазины
export interface IOutlet extends INamedEntity, IReferenceData {
  company: INamedEntity; //организация-плательщик
  address: string; //Адрес разгрузки
  phoneNumber: string; // Номер телефона
  lat: number; // широта
  lon: number; // долгота
}
//Задолженности
export interface IDebt extends INamedEntity {
  ondate: string; //на дату
  saldo: number; //Задолженность
  saldoDebt: number; //Просроченная задолженность
  dayLeft?: number;
}

//Подразделения-склады
export type IDepartment = INamedEntity;

export interface IGoodMatrix {
  [id: string]: IMatrixData[];
}

export interface IMatrixData {
  goodId: string;
  priceFso: number; // цена ФСО
  priceFsn: number; // цена ФСН
  priceFsoSklad: number; // цена ФСО склад
  priceFsnSklad: number; // цена ФСН склад
}

export interface IMatrixDataNamed extends IMatrixData {
  [fieldName: string]: number | string | undefined;
  goodName: string;
}

export type IPackage = INamedEntity;

export interface IPackageGood extends IEntity {
  good: INamedEntity;
  package: INamedEntity;
  isDefault?: number;
}

export interface IOrderHead extends IHead {
  contact: IReferenceData; //организация-плательщик
  outlet: IReferenceData; // магазин –подразделение организации плательщика
  route?: IReferenceData; // 	Маршрут
  depart?: IReferenceData; // Необязательное поле склад (подразделение предприятия-производителя)
  onDate: string; //  Дата отгрузки
  takenOrder?: TakeOrderType; //тип взятия заявки
  comment?: string;
}

export interface IOrderLine extends IEntity {
  good: IGood;
  quantity: number;
  package?: INamedEntity; // Вид упаковки
}

export interface IOrderTotalLine {
  group: INamedEntity;
  quantity: number;
  s: number;
}

export type IOrderDocument = MandateProps<IDocument<IOrderHead, IOrderLine>, 'head' | 'lines'>;

interface IRouteHead extends IHead {
  agent: INamedEntity;
}

export interface IRouteLine extends IEntity {
  outlet: INamedEntity;
  ordNumber: number; // порядковый номер
  comment?: string;
  visited: boolean;
  /* result?: typeVisit; -это убрать в визиты */
}

export interface IRouteTotalLine {
  group: INamedEntity;
  quantity: number;
}

export type IRouteDocument = MandateProps<IDocument<IRouteHead, IRouteLine>, 'head' | 'lines'>;

interface IReturnHead extends IHead {
  contact: IReferenceData;
  outlet: IReferenceData;
  route?: IReferenceData; // 	Маршрут
}

export interface IReturnLine extends IEntity {
  good: INamedEntity;
  quantity: number;
  sellBillId?: string;
  quantityFromSellBill?: number;
  priceFromSellBill?: number;
}

export type IReturnDocument = MandateProps<IDocument<IReturnHead, IReturnLine>, 'head' | 'lines'>;

export interface ISellBill extends IEntity {
  number: string;
  contract?: INamedEntity;
  depart?: INamedEntity;
  documentdate: string;
  quantity: number;
  price: number;
}

export interface ISellBillHead extends IHead {
  outlet?: INamedEntity;
  contact?: INamedEntity;
  route?: INamedEntity;
  depart?: INamedEntity;
  dateBegin?: string;
  dateEnd?: string;
}

export interface ISellBillLine extends IEntity {
  good?: INamedEntity;
  quantity: number;
}

export type ISellBillDocument = MandateProps<IDocument<ISellBillHead, ISellBillLine>, 'head' | 'lines'>;

export type TakeOrderType = 'ON_PLACE' | 'BY_PHONE' | 'BY_EMAIL';

export type VisitResultType = 'ALL_COMPLETED' | 'NOT_COMPLETED' | 'PARTLY_COMPLETED';

interface IVisitHead extends IHead {
  routeLineId: string;
  comment?: string;
  dateBegin: string; //начало визита
  dateEnd?: string; // конец визита
  beginGeoPoint?: ICoords; //место начало визита
  endGeoPoint?: ICoords; // место завершения визита
  result?: VisitResultType;
  takenType: TakeOrderType; //тип визита - это поле забрать из заявки
}

export type IVisitDocument = MandateProps<IDocument<IVisitHead>, 'head'>;

export const visitDocumentType: IDocumentType = {
  id: 'visit',
  name: 'visit',
  description: 'Визит',
};

export interface IToken {
  access_token: string;
}

export type AppThunk<ReturnType = void, S = void, A extends AnyAction = AnyAction> = ThunkAction<
  ReturnType,
  S,
  unknown,
  A
>;
