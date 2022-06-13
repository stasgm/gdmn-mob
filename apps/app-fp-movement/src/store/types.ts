import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { INamedEntity, IEntity, IDocument, MandateProps, IHead, StatusType, IReferenceData } from '@lib/types';
import { IFormParam } from '@lib/store';

import { ICodeEntity, IGood } from './app/types';

export interface IMovementFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  status?: StatusType;
  fromDepart?: ICodeEntity;
  toDepart?: ICodeEntity;
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

export interface IMovementHead extends IHead {
  fromDepart: ICodeEntity;
  toDepart: ICodeEntity; //Подразделение
  comment?: string; // Комvентарий
}

export interface IMovementLine extends IEntity {
  good: IGood;
  weight: number;
  workDate: string; // Дата производства
  numReceived: string; // Номер партии
  barcode?: string; // технологический код
}

export type IMovementDocument = MandateProps<IDocument<IMovementHead, IMovementLine>, 'head' | 'lines'>;

export interface IOrderHead extends IHead {
  contact: ICodeEntity; //организация-плательщик
  outlet: ICodeEntity; // магазин –подразделение организации плательщика
  onDate: string; //  Дата отгрузки
  shcode: string;
}

export interface IOrderLine extends IEntity {
  good: IGood;
  quantity: number;
  packagekey?: INamedEntity; // Вид упаковки
}

export type IOrderDocument = MandateProps<IDocument<IMovementHead, IMovementLine>, 'head' | 'lines'>;

export type TakeOrderType = 'ON_PLACE' | 'BY_PHONE' | 'BY_EMAIL';

export type AppThunk<ReturnType = void, S = void, A extends AnyAction = AnyAction> = ThunkAction<
  ReturnType,
  S,
  unknown,
  A
>;

export interface IBarcode {
  barcode?: string;
  weight: number;
  workDate: string;
  shcode: string;
  numReceived: string; // Номер партии
}
