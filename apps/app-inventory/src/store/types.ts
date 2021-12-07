import { INamedEntity, IEntity, IDocument, MandateProps, IHead, IReferenceData } from '@lib/types';

//Группы товаров
export interface IGoodGroup extends INamedEntity {
  parent?: INamedEntity;
}
// Товары
export interface IGood extends INamedEntity {
  alias: string;
  barcode: string;
  vat: string; //НДС
  goodgroup: INamedEntity; // группа товаров
  valuename: string; // Наименование ед. изм.
  weightCode?: string;
  invWeight: number; // Вес единицы товара
  priceFso: number; // цена ФСО
  priceFsn: number; // цена ФСН
}

//Подразделения-склады
export type IDepartment = INamedEntity;

//Организации
export interface IContact extends INamedEntity, IReferenceData {
  contractNumber: string; // Номер договора
  contractDate: string; // Дата договора
  paycond: string; // Условие оплаты
  phoneNumber: string; // Номер телефона
}

export interface IInventoryHead extends IHead {
  onDate?: string; //Дата
  depart?: IContact; // Поле склад
  contact?: IDepartment; //Подразделение
  comment?: string; // Комvентарий
}

export interface IInventoryLine extends IEntity {
  good: INamedEntity;
  quantity: number;
  packagekey?: INamedEntity; // Вид упаковки
  price?: number;
  remains?: number;
}

export type IInventoryDocument = MandateProps<IDocument<IInventoryHead, IInventoryLine>, 'head' | 'lines'>;

//* Model *//
export interface IModelRem {
  price: number;
  q: number;
}

export interface IRem extends IGood {
  remains?: number;
  price?: number;
}

export interface IWeightCodeSettings {
  weightCode: string;
  code: number;
  weight: number;
}
export interface IMGoodRemain extends IGood {
  remains?: IModelRem[];
}

export interface IMDGoodRemain {
  contactName: string;
  goods: IMGoodData<IMGoodRemain>;
}

export interface IMGoodData<T = unknown> {
  [id: string]: T;
}

export interface IModelData<T = unknown> {
  [id: string]: T;
}
