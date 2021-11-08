import { INamedEntity } from '@lib/types';

export type AppTradeState = {
  readonly model: IModel;
  readonly loading: boolean;
  readonly errorMessage: string;
};

export interface IModel {
  [outletId: string]: IGood[];
}

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
