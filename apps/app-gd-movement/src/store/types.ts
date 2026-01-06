import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import {
  INamedEntity,
  IEntity,
  IDocument,
  MandateProps,
  IHead,
  StatusType,
  IReferenceData,
  IDocumentType,
} from '@lib/types';
import { IFormParam } from '@lib/store';
import { IListItem } from '@lib/mobile-types';

export interface IDocFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  documentType?: IDocumentType;
  status?: StatusType;
  fromContactType?: IListItem;
  fromContact?: Department;
  toContactType?: IListItem;
  toContact?: Department;
  comment?: string;
}

export interface IScanFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  status?: StatusType;
  department?: Department;
  comment?: string;
  isBindGood?: boolean;
}

export interface IRevisionFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  status?: StatusType;
  department?: Department;
  comment?: string;
}

export interface IInvoiceFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  status?: StatusType;
  depart?: Department;
  comment?: string;
}

export interface IWaybillFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  status?: StatusType;
  // depart?: Department;
  // fromContact?: Department;
  // toContact?: Department;
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
  taxId?: string; //УНП
}

export interface IMovementHead extends IHead {
  fromContact?: Department;
  toContact?: Department; //Подразделение
  fromContactType?: IListItem;
  toContactType?: IListItem;
  comment?: string;
}

export interface IMovementLine extends IEntity {
  good: INamedEntity;
  quantity: number;
  price?: number;
  buyingPrice?: number; // покупная цена
  remains?: number;
  barcode?: string;
  EID?: string;
  // EIDlist?: string[];
  docType?: string;
  weightCode?: string;
  alias?: string;
  sortOrder?: number; // порядок сортировки
  sumWNds?: number; // сумма с ндс
}

export type IMovementDocument = MandateProps<IDocument<IMovementHead, IMovementLine>, 'head' | 'lines'>;

export interface IScanHead extends IHead {
  department?: Department;
  isBindGood?: boolean;
  comment?: string;
}

export interface IScanLine extends IEntity {
  barcode: string;
  good?: INamedEntity;
  sortOrder?: number;
}

export type IScanDocument = MandateProps<IDocument<IScanHead, IScanLine>, 'head' | 'lines'>;

export interface IRevisionHead extends IHead {
  department: Department;
  comment?: string;
}

export interface IRevisionLine extends IEntity {
  barcode: string;
  good?: INamedEntity;
  price?: number;
  remains?: number;
  sortOrder?: number;
  withGood?: boolean;
}

export type IRevisionDocument = MandateProps<IDocument<IRevisionHead, IRevisionLine>, 'head' | 'lines'>;

export interface IInvoiceHead extends IHead {
  fromContact?: Department;
  toContact?: Department; //Подразделение
  fromContactType?: IListItem;
  toContactType?: IListItem;
  comment?: string;
  depart: INamedEntity;
}

export interface IInvoiceLine extends IEntity {
  good: INamedEntity;
  quantity: number;
  price?: number;
  barcode?: string;
  EID?: string;
  eidList?: string[];
  eidType: '0' | '1' | '2' | '3';
  sortOrder?: number; // порядок сортировки
}

export type IInvoiceDocument = MandateProps<IDocument<IInvoiceHead, IInvoiceLine>, 'head' | 'lines'>;

export interface IWaybillHead extends IHead {
  // fromContact?: Department;
  // toContact?: Department; //Подразделение
  // fromContactType?: IListItem;
  // toContactType?: IListItem;
  comment?: string;
  // depart: INamedEntity;
  //дата?
}

export interface IWaybillLine extends IEntity {
  goodId: string;
  quantity?: number;
  // price?: number;
  barcode?: string;
  EID?: string;
  aggregationCode?: string;
  sortOrder?: number; // порядок сортировки
  checked?: boolean;
  added?: boolean;
  description?: string;
  checkedQuantity?: number;
}

export type IWaybillDocument = MandateProps<IDocument<IWaybillHead, IWaybillLine>, 'head' | 'lines'>;

export interface IDataMarkHead extends IHead {
  fromContact?: Department;
  toContact?: Department; //Подразделение
  // fromContactType?: IListItem;
  // toContactType?: IListItem;
  comment?: string;
  // depart: INamedEntity;
}

export interface IDataMarkLine extends IEntity {
  good: INamedEntity;
  quantity: number;
  price?: number;
  barcode?: string;
  EID?: string;
  // eidList?: string[];
  // eidType?: 0 | 1 | 2 | 3;
  checked?: boolean;
  sortOrder?: number; // порядок сортировки
}

export type IDataMarkDocument = MandateProps<IDocument<IDataMarkHead, IDataMarkLine>, 'head' | 'lines'>;

export type AppThunk<ReturnType = void, S = void, A extends AnyAction = AnyAction> = ThunkAction<
  ReturnType,
  S,
  unknown,
  A
>;
