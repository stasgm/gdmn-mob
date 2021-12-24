import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import {
  INamedEntity,
  IEntity,
  IDocument,
  MandateProps,
  IHead,
  IReferenceData,
  IDocumentType,
  StatusType,
  RefTypeChoose,
} from '@lib/types';

// eslint-disable-next-line import/no-cycle
import { IGood } from './app/types';

export { IGood };

export interface IFormParam {
  [fieldName: string]: unknown;
}
export interface IInventoryFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  onDate?: string;
  status?: StatusType;
  department?: IDepartment;
  comment?: string;
}

export interface INewFormParam<T = Set> extends IFormParam {
  number?: string;
  documentDate?: string;
  onDate?: string;
  status?: StatusType;
  department?: IDepartment;
  comment?: string;
  type?: /*string; // |*/ RefTypeChoose | string;
}

export type Set = string | number | boolean | undefined;
type MetaData<T = Record<string, Set>> = {
  [P in keyof T]?: INewFormParam<T[P]>;
};

export { MetaData };

//Группы товаров
export interface IGoodGroup extends INamedEntity {
  parent?: INamedEntity;
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
  department?: IDepartment; //Подразделение
  comment?: string; // Комvентарий
}

export interface IInventoryLine extends IEntity {
  good: INamedEntity;
  quantity: number;
  packagekey?: INamedEntity; // Вид упаковки
  price?: number;
  remains?: number;
  barcode?: string;
  EID?: string;
}

export type IInventoryDocument = MandateProps<IDocument<IInventoryHead, IInventoryLine>, 'head' | 'lines'>;

//* Model *//
export interface IModelRem {
  price?: number;
  q?: number;
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

export type AppThunk<ReturnType = void, S = void, A extends AnyAction = AnyAction> = ThunkAction<
  ReturnType,
  S,
  unknown,
  A
>;
