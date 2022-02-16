import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { INamedEntity, IEntity, IDocument, MandateProps, IHead, StatusType } from '@lib/types';

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

export interface IMovementFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  onDate?: string;
  status?: StatusType;
  departmentFrom?: IDepartment;
  departmentTo?: IDepartment;
  comment?: string;
}

//Подразделения-склады
export type IDepartment = INamedEntity;

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

export interface IMovementHead extends IHead {
  departmentFrom?: IDepartment; //Подразделение
  departmentTo?: IDepartment; //Подразделение
  comment?: string; // Комvентарий
}

export interface IMovementLine extends IEntity {
  good: INamedEntity;
  quantity: number;
  packagekey?: INamedEntity; // Вид упаковки
  price?: number;
  remains?: number;
  barcode?: string;
  EID?: string;
  docType?: string;
}

export type IMovementDocument = MandateProps<IDocument<IMovementHead, IMovementLine>, 'head' | 'lines'>;

export interface IBarcode extends IEntity {
  barcode?: string;
}

export type AppThunk<ReturnType = void, S = void, A extends AnyAction = AnyAction> = ThunkAction<
  ReturnType,
  S,
  unknown,
  A
>;
