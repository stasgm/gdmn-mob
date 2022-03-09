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
import { IListItem } from '@lib/mobile-types';

export interface IFormParam {
  [fieldName: string]: unknown;
}
export interface IInventoryFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  onDate?: string;
  status?: StatusType;
  department?: IDepartment;
  comment?: string;
}

export interface IDocFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  onDate?: string;
  status?: StatusType;
  docType?: IDocument;
  documentType: IDocumentType;
  department?: IDepartment;
  fromContact?: IDepartment;
  toContact?: IDepartment;
  contact?: IContact;
  comment?: string;
  fromContactType?: IListItem;
  toContactType?: IListItem;
}

//Подразделения-склады
export type IDepartment = INamedEntity;
export type IDepartmentType = INamedEntity;

export interface IContact extends INamedEntity, IReferenceData {
  contractNumber: string; // Номер договора
  contractDate: string; // Дата договора
  paycond: string; // Условие оплаты
  phoneNumber: string; // Номер телефона
}

export interface IInventoryHead extends IHead {
  department?: IDepartment; //Подразделение
  comment?: string; // Комvентарий
}

export interface IInventoryLine extends IEntity {
  good: INamedEntity;
  quantity: number;
  packagekey?: INamedEntity; // Вид упаковки
  price?: number;
  remains?: number;
  barcode?: string;
  EID?: string;
  docType?: string;
}

export type IInventoryDocument = MandateProps<IDocument<IInventoryHead, IInventoryLine>, 'head' | 'lines'>;

export interface IDocHead extends IHead {
  fromContact?: IDepartment;
  toContact?: IDepartment; //Подразделение
  contact?: IContact;
  comment?: string; // Комvентарий
}

export interface IDocLine extends IEntity {
  good: INamedEntity;
  quantity: number;
  packagekey?: INamedEntity; // Вид упаковки
  price?: number;
  remains?: number;
  barcode?: string;
  EID?: string;
  docType?: string;
}

export type IDocDocument = MandateProps<IDocument<IDocHead, IDocLine>, 'head' | 'lines'>;

export type AppThunk<ReturnType = void, S = void, A extends AnyAction = AnyAction> = ThunkAction<
  ReturnType,
  S,
  unknown,
  A
>;
