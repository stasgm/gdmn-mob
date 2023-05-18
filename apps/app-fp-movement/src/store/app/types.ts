import { IEntity, INamedEntity } from '@lib/types';

import { ICellRef } from '../types';

export interface ICodeEntity extends INamedEntity {
  shcode: string;
}

export interface IAddressStoreEntity extends INamedEntity {
  isAddressStore?: boolean;
}

export type FpMovementState = {
  readonly list: ITempDocument[];
  readonly loading: boolean;
  readonly loadingData: boolean;
  readonly errorMessage: string;
  readonly loadingError: string;
};

// Товары
export interface IGood extends ICodeEntity {
  goodGroupId?: string;
}

export interface IEmployee extends INamedEntity {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  position: INamedEntity;
}

export interface IBarcode {
  barcode: string;
  weight: number;
  workDate: string;
  shcode: string;
  numReceived: string; // Номер партии
  quantPack: number;
}

export interface ITempDocument extends IEntity {
  orderId: string;
  lines?: ITempLine[];
}

export interface ITempLine extends IEntity {
  good: IGood; // товар
  weight: number; //вес
  packagekey?: INamedEntity; // Вид упаковки
}

export interface IModelData {
  [id: string]: IChamberData;
}

export interface IChamberData {
  [id: string]: IRowData;
}

export interface IRowData {
  [id: string]: ICellData[];
}

export interface ICellRefList {
  [id: string]: ICellRef[];
}

export interface ICellData extends ICellRef {
  cell: string;
}

export interface IMGoodData<T = unknown> {
  [id: string]: T;
}

export interface IMGoodRemain {
  good: IGood;
  remains?: IModelRem[];
}
export interface IRemainsData {
  goodId: string;
  q?: number;
  workDate: string;
  numReceived: string;
}

export interface IModelRem {
  workDate: string;
  numReceived: string;
  q: number;
}

export interface IRemGood {
  good: IGood;
  remains: number;
  workDate: string;
  numReceived: string;
}

export interface IRemains {
  [id: string]: IRemainsData[];
}
