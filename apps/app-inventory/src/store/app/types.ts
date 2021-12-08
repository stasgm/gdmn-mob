import { INamedEntity } from '@lib/types';

export type AppInventoryState = {
  readonly model: IModel;
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
  barcode: string;
  vat: string; //НДС
  goodGroup: INamedEntity; // группа товаров
  valuename: string; // Наименование ед. изм.
  invWeight: number; // Вес единицы товара
  priceFso: number; // цена ФСО
  priceFsn: number; // цена ФСН
  priceFsoSklad: number; // цена ФСО склад
  priceFsnSklad: number; // цена ФСН склад
  scale: number; //количество единиц в месте
}
