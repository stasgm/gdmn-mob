import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { INamedEntity, IEntity, IDocument, MandateProps, IHead, StatusType } from '@lib/types';
import { IFormParam } from '@lib/store';

export interface IMovementFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  onDate?: string;
  status?: StatusType;
  fromPlace?: IDepartment;
  toPlace?: IDepartment;
}

//Подразделения-склады
export type IDepartment = INamedEntity;

export interface IMovementHead extends IHead {
  fromPlace?: IDepartment; //Подразделение
  toPlace?: IDepartment; //Подразделение
}

export interface IMovementLine extends IEntity {
  barcode?: string;
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
