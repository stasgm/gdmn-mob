import { INamedEntity } from '@lib/types';

export type AppTradeState = {
  readonly goodModel: IModelData<IGoodModel>;
  readonly loading: boolean;
  readonly loadingData: boolean;
  readonly errorMessage: string;
  readonly loadingError: string;
};

// Товары
export interface IGood extends INamedEntity {
  alias: string;
  barcode: string;
  vat: string; //НДС
  goodgroup: INamedEntity; // группа товаров
  valuename: string; // Наименование ед. изм.
  invWeight: number; // Вес единицы товара
  priceFso: number; // цена ФСО
  priceFsn: number; // цена ФСН
  priceFsoSklad: number; // цена ФСО склад
  priceFsnSklad: number; // цена ФСН склад
  scale: number; //количество единиц в месте
}

//* Model *//
export type IMGood = Omit<IGood, 'goodgroup' | 'id'>;

export interface IGoodModel {
  contactName: string;
  onDate: Date;
  goods: IMParentGroupData<IMGroupData<IMGoodData<IGood>>>;
}

export interface IMParentGroupData<T = unknown> {
  [id: string]: T;
}

export interface IMGroupData<T = unknown> {
  [id: string]: T;
}

export interface IMGoodData<T = unknown> {
  [id: string]: T;
}

export interface IModelData<T = unknown> {
  [contactId: string]: T;
}
