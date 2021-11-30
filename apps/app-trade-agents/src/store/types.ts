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
import { AppTradeActionType } from './app-trade/actions';

// eslint-disable-next-line import/no-cycle
import { IModel, IGood } from './app-trade/types';

export { IModel, IGood };

export interface IFormParam {
  [fieldName: string]: unknown;
}

export interface IOrderFormParam extends IFormParam {
  contact?: INamedEntity;
  outlet?: INamedEntity;
  depart?: INamedEntity;
  number?: string;
  documentDate?: string;
  onDate?: string;
  status?: StatusType;
  route?: INamedEntity;
}

export interface IReturnFormParam extends IFormParam {
  contact?: INamedEntity;
  outlet?: INamedEntity;
  number?: string;
  documentDate?: string;
  depart?: INamedEntity;
  reason?: string;
  route?: INamedEntity;
  status?: StatusType;
}

export interface ISellBillFormParam extends IFormParam {
  dateBegin?: string;
  dateEnd?: string;
  good?: INamedEntity;
}

// export type typeTakeOrder = 'ONPLACE' | 'BYPHONE' | 'BYEMAIL';

// export type typeVisit = 'ORDER' | 'REFUSE' | 'RETURN';
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
export interface IDebt extends IEntity {
  id: string;
  contact: INamedEntity; //организация-плательщик
  ondate: string; //на дату
  saldo: number; //Задолженность
  saldoDebt: number; //Просроченная задолженность
}
//Группы товаров
export interface IGoodGroup extends INamedEntity {
  parent?: INamedEntity;
}

//Подразделения-склады
export type IDepartment = INamedEntity;
// Интерфейс для матрицы номенклатур для организаций
export interface INetPrice extends IEntity {
  contact: INamedEntity; // организация
  good: INamedEntity; // ID товара
  pricefso?: number; // цена ФСО
  pricefsn?: number; // цена ФСН
  priceFsoSklad?: number; // цена ФСО склад
  priceFsnSklad?: number; // цена ФСН склад
}

export type IPackage = INamedEntity;

export interface IPackageGood extends IEntity {
  good: INamedEntity;
  package: INamedEntity;
}

export interface IOrderHead extends IHead {
  contact: INamedEntity; //организация-плательщик
  outlet: INamedEntity; // магазин –подразделение организации плательщика
  route?: INamedEntity; // 	Маршрут
  depart?: INamedEntity; // Необязательное поле склад (подразделение предприятия-производителя)
  onDate: string; //  Дата отгрузки
  takenOrder?: TakeOrderType; //тип взятия заявки
}

export interface IOrderLine extends IEntity {
  good: INamedEntity;
  quantity: number;
  packagekey?: INamedEntity; // Вид упаковки
}

export type IOrderDocument = MandateProps<IDocument<IOrderHead, IOrderLine>, 'head' | 'lines'>;
// export type IOrderDocument = IDocument<IOrderHead, IOrderLine[]>;

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
  contact: INamedEntity;
  outlet: INamedEntity;
  route?: INamedEntity; // 	Маршрут
}

export interface IReturnLine extends IEntity {
  good: INamedEntity;
  quantity: number;
  quantityFromSellBill?: number;
  priceFromSellBill?: number;
  sellBillId: string;
}

export type IReturnDocument = MandateProps<IDocument<IReturnHead, IReturnLine>, 'head' | 'lines'>;

export interface ISellBill extends IEntity {
  ID: string;
  NUMBER: string;
  CONTRACT?: string;
  CONTRACTKEY?: string;
  DEPARTNAME?: string;
  DEPARTKEY?: string;
  DOCUMENTDATE: string;
  QUANTITY: number;
  PRICE: number;
}

export interface ISellBillItem extends ISellBill {
  valueName: string;
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

