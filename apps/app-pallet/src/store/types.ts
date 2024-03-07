import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { INamedEntity, IEntity, IDocument, MandateProps, IHead, StatusType, IReferenceData } from '@lib/types';
import { IFormParam } from '@lib/store';

export interface IPalletFormParam extends IFormParam {
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

export interface IPalletHead extends IHead {
  palletId: string;
  // department?: Department;
  // isBindGood?: boolean;
  // comment?: string;
}

export interface IPalletLine extends IEntity {
  barcode: string;
  sortOrder?: number;
}

export type IPalletDocument = MandateProps<IDocument<IPalletHead, IPalletLine>, 'head' | 'lines'>;

export type AppThunk<ReturnType = void, S = void, A extends AnyAction = AnyAction> = ThunkAction<
  ReturnType,
  S,
  unknown,
  A
>;
