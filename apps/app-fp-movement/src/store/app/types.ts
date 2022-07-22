import { IEntity, INamedEntity } from '@lib/types';

export interface ICodeEntity extends INamedEntity {
  shcode: string;
}

export type FpMovementState = {
  readonly list: IOrder[];
  readonly loading: boolean;
  readonly loadingData: boolean;
  readonly errorMessage: string;
  readonly loadingError: string;
};

// Товары
export interface IGood extends ICodeEntity {
  valueName?: string; // Наименование ед. изм.
  invWeight?: number; // Вес единицы товара
  scale?: number; //количество единиц в месте
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

export interface IOrder<K extends IEntity = IEntity> extends IEntity {
  lines?: K[];
}
