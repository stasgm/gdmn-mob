import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { INamedEntity, IEntity, IDocument, MandateProps, IHead, StatusType, IReferenceData } from '@lib/types';
import { IFormParam } from '@lib/store';

import { ICodeEntity, IGood } from './app/types';

export { ITempLine, ITempDocument } from './app/types';

export interface IMoveFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  status?: StatusType;
  fromDepart?: ICodeEntity;
  toDepart?: ICodeEntity;
  comment?: string;
}

export interface ISellbillFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  status?: StatusType;
  comment?: string;
}

export interface IFreeSellbillFormParam extends IFormParam {
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

export interface IMoveHead extends IHead {
  fromDepart: ICodeEntity;
  toDepart: ICodeEntity; //Подразделение
  comment?: string; // Комvентарий
}

export interface IMoveLine extends IEntity {
  good: IGood;
  weight: number;
  workDate: string; // Дата производства
  numReceived: string; // Номер партии
  barcode?: string; // технологический код
  sortOrder?: number; // порядок сортировки
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

export interface ISellbillHead extends IHead {
  contact: ICodeEntity; //организация-плательщик
  outlet: ICodeEntity; // магазин –подразделение организации плательщика
  depart: ICodeEntity; // подразделеніе сотрудника (кладовщик, работающий с терминалом)
  onDate: string; // Дата отгрузки
  barcode: string; // штрих-код заявки, по которой создан
  // ovСode?: string; // штрих-код документа-отвеса
  orderId: string;
}

export interface ISellbillLine extends IEntity {
  good: IGood; // товар
  weight: number; //вес
  workDate: string; // Дата производства
  numReceived: string; // Номер партии
  barcode: string; // технологический код
  quantPack: number; // порядковый номер сканирования в документе
  sortOrder?: number; // порядок сортировки
}

export type ISellbillDocument = MandateProps<IDocument<ISellbillHead, ISellbillLine>, 'head' | 'lines'>;

export interface IFreeSellbillHead extends IHead {
  depart: ICodeEntity;
  comment?: string; // Комvентарий
}
export interface IFreeSellbillLine extends IEntity {
  good: IGood;
  weight: number;
  workDate: string; // Дата производства
  numReceived: string; // Номер партии
  barcode?: string; // технологический код
  sortOrder?: number; // порядок сортировки
}
export type IFreeSellbillDocument = MandateProps<IDocument<IFreeSellbillHead, IFreeSellbillLine>, 'head' | 'lines'>;

export type TakeOrderType = 'ON_PLACE' | 'BY_PHONE' | 'BY_EMAIL';

export type AppThunk<ReturnType = void, S = void, A extends AnyAction = AnyAction> = ThunkAction<
  ReturnType,
  S,
  unknown,
  A
>;
