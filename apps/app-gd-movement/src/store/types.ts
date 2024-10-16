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
  comment?: string; // Комvентарий
}

export interface IMovementLine extends IEntity {
  good: INamedEntity;
  quantity: number;
  price?: number;
  buyingPrice?: number;
  remains?: number;
  barcode?: string;
  EID?: string;
  docType?: string;
  weightCode?: string;
  alias?: string;
  sortOrder?: number; // порядок сортировки
}

export type IMovementDocument = MandateProps<IDocument<IMovementHead, IMovementLine>, 'head' | 'lines'>;

export interface IScanHead extends IHead {
  department?: Department;
  isBindGood?: boolean;
  comment?: string; // Комvентарий
}

export interface IScanLine extends IEntity {
  barcode: string;
  good?: INamedEntity;
  sortOrder?: number;
}

export type IScanDocument = MandateProps<IDocument<IScanHead, IScanLine>, 'head' | 'lines'>;

export type AppThunk<ReturnType = void, S = void, A extends AnyAction = AnyAction> = ThunkAction<
  ReturnType,
  S,
  unknown,
  A
>;
