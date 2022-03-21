import { INamedEntity } from '@lib/types';

export type AppInventoryState = {
  readonly model: IModelData<IMDGoodRemain>;
  readonly loading: boolean;
  readonly loadingData: boolean;
  readonly errorMessage: string;
  readonly loadingError: string;
};

export interface IMDGoodRemain {
  contactName: string;
  goods: IMGoodData<IMGoodRemain>;
}

export interface IModelData<T = unknown> {
  [id: string]: T;
}

export interface IMGoodData<T = unknown> {
  [id: string]: T;
}

export interface IMGoodRemain {
  good: IGood;
  remains?: IModelRem[];
}

export interface IModelRem {
  price: number;
  q: number;
}

export interface IRem extends IGood {
  remains?: number;
  price?: number;
}

export interface IRemainsData {
  goodId: string;
  q?: number;
  price?: number;
}

export interface IRemains {
  [id: string]: IRemainsData[];
}
// Товары
export interface IGood extends INamedEntity {
  alias: string;
  barcode?: string;
  vat?: string; //НДС
  weightCode?: string;
  goodGroup: INamedEntity; // группа товаров
  valueName?: string; // Наименование ед. изм.
  invWeight?: number; // Вес единицы товара
  price?: number; //Цена
  scale?: number; //количество единиц в месте
}

export interface IRemGood {
  good: IGood;
  price: number;
  remains: number;
}
