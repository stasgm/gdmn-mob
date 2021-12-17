import { INamedEntity } from '@lib/types';

// eslint-disable-next-line import/no-cycle
import { IMDGoodRemain, IModelData } from '../types';

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
