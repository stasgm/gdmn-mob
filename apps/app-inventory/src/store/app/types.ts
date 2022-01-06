import { INamedEntity } from '@lib/types';

export interface IModelData<T = unknown> {
  [id: string]: T;
}

export interface IModelRem {
  price?: number;
  q?: number;
}

export interface IMGoodRemain extends IGood {
  remains?: IModelRem[];
}

export interface IMGoodData<T = unknown> {
  [id: string]: T;
}

export interface IMDGoodRemain {
  contactName: string;
  goods: IMGoodData<IMGoodRemain>;
}

export type AppInventoryState = {
  readonly model: IModelData<IMDGoodRemain>;
  readonly loading: boolean;
  readonly errorMessage: string;
};

export interface IModel {
  [contactId: string]: IParentGroupModel;
}

export interface IParentGroupModel {
  [parentGroupId: string]: IGroupModel;
}

export interface IGroupModel {
  [groupId: string]: IGood[];
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

export interface IRem extends IGood {
  remains?: number;
  price?: number;
}
