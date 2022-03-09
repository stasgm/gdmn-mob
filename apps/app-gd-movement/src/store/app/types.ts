import { INamedEntity } from '@lib/types';

export type AppInventoryState = {
  readonly model: IModelData<IMDGoodRemains>;
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

// export interface IMGoodRemain extends IGood {
//   remains?: IModelRem[];
// }
export interface IMGoodRemains extends IGood {
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

export interface IRemains {
  contactId: string;
  date: Date;
  data: IRemainsData[];
}

export interface IRemainsData {
  goodId: string;
  q?: number;
  price?: number;
}

// Товары
export interface IGood extends INamedEntity {
  alias: string;
  barcode?: string;
  vat?: string; //НДС
  weightCode?: string;
  goodGroup: INamedEntity; // группа товаров
  valuename?: string; // Наименование ед. изм.
  invWeight?: number; // Вес единицы товара
  price?: number; //Цена
  scale?: number; //количество единиц в месте
}
export interface IRemainsNew {
  [id: string]: IRemainsData[];
}
