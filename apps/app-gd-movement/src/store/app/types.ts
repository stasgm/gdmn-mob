import { INamedEntity } from '@lib/types';

export type AppInventoryState = {
  readonly model: IModelData<IMDGoodRemains>;
  readonly unknownGoods: IGood[];
  readonly loading: boolean;
  readonly loadingData: boolean;
  readonly errorMessage: string;
  readonly loadingError: string;
};

export interface IMDGoodRemains {
  contactName: string;
  goods: IMGoodData<IMGoodRemains>;
}

export interface IMGoodRemain {
  good: IGood;
  remains?: IModelRem[];
}

export interface IModelData<T = unknown> {
  [id: string]: T;
}

export interface IMGoodData<T = unknown> {
  [id: string]: T;
}
export interface IMGoodRemains extends IGood {
  remains?: IModelRem[];
}

export interface IModelRem {
  price: number;
  buyingPrice?: number;
  q: number;
}

export interface IRemains {
  [id: string]: IRemainsData[];
}

export interface IRemainsData {
  goodId: string;
  q?: number;
  price?: number;
  buyingPrice?: number;
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
  buyingPrice?: number;
  scale?: number; //количество единиц в месте
  unknown_id?: string;
}

export interface IRemGood {
  good: IGood;
  price: number;
  buyingPrice?: number;
  remains: number;
}

export interface IEmployee extends INamedEntity {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  position: INamedEntity;
}
