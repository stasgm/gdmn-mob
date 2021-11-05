import { INamedEntity, IEntity, IDocument, MandateProps, IHead, IReferenceData, IDocumentType } from '@lib/types';
// import { AnyAction } from 'redux';
// import { ThunkAction } from 'redux-thunk';

import { ICoords } from './geo/types';

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
// Товары
export interface IGood extends INamedEntity {
  alias: string;
  barcode: string;
  vat: string; //НДС
  goodgroup: INamedEntity; // группа товаров
  valuename: string; // Наименование ед. изм.
  invWeight: number; // Вес единицы товара
  priceFso: number; // цена ФСО
  priceFsn: number; // цена ФСН
  priceFsoSklad: number; // цена ФСО склад
  priceFsnSklad: number; // цена ФСН склад
  scale: number; //количество единиц в месте
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
  depart?: INamedEntity;
  reason: string;
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
  contact: INamedEntity; //организация-плательщик
  route?: INamedEntity; // 	Маршрут
  depart?: INamedEntity; // Необязательное поле склад (подразделение предприятия-производителя)
  dateBegin?: string; //  Дата отгрузки
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

// export type AppThunk<ReturnType = void, S = void, A extends AnyAction = AnyAction> = ThunkAction<
//   ReturnType,
//   S,
//   unknown,
//   A
// >;

/* export interface ICoords {
  latitude: number;
  longitude: number;
}
 */
/* export type resutVisit = 'DONE' | 'NOT DONE' | 'PART';
export interface IVisitDocument extends IEntity {
  routeLineId: number;
  comment?: string;
  dateBegin: string; //начало визита
  dateEnd?: string; // конец визита
  beginGeoPoint: ICoords; //место начало визита
  endGeoPoint?: ICoords; // место завершения визита
  result?: resutVisit;
  takenType: typeTakeOrder; //тип визита - это поле забрать из заявки
}
*/
