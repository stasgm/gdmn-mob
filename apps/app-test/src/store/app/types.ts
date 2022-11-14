import { IFormParam } from '@lib/store';
import { INamedEntity } from '@lib/types';

export type AppTestState = {
  readonly loading: boolean;
  readonly formParams: IFormParam;
};

// Товары
export interface IGood extends INamedEntity {
  [fieldName: string]: unknown;
  alias: string;
  barcode: string;
  vat: string; //НДС
  goodgroup: INamedEntity; // группа товаров
  valueName: string; // Наименование ед. изм.
  invWeight: number; // Вес единицы товара
  priceFso: number; // цена ФСО
  priceFsn: number; // цена ФСН
  priceFsoSklad: number; // цена ФСО склад
  priceFsnSklad: number; // цена ФСН склад
  scale: number; //количество единиц в месте
}

//Группы товаров
export interface IGoodGroup extends INamedEntity {
  parent?: INamedEntity;
}

//* Model *//
export type IMGood = Omit<IGood, 'goodgroup' | 'id'>;

export interface IGoodModel {
  contactName: string;
  onDate: Date;
  goods: IMParentGroupData<IMGroupData<IMGoodData<IGood>>>;
}

export interface IGoodModelNew {
  [parentGroupId: string]: IMGroupData<number>;
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

export interface IMGroup {
  group: IGoodGroup;
  goodCount?: number;
  goods?: IGood[];
}

export interface IMGroupParent {
  parent: IGoodGroup;
  children?: IMGroup[];
}

export interface IMGroupModel {
  [parentId: string]: IMGroupParent;
}