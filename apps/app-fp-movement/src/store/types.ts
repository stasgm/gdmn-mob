import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { INamedEntity, IEntity, IDocument, MandateProps, IHead, StatusType, IReferenceData } from '@lib/types';
import { IFormParam } from '@lib/store';

import { IGood } from './app/types';

export interface IMovementFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  status?: StatusType;
  fromDepart?: Department;
  toDepart?: Department;
  comment?: string;
}

//Подразделения-склады
export type Department = INamedEntity;
export type DepartmentType = INamedEntity;

export interface IContact extends INamedEntity, IReferenceData {
  contractNumber: string; // Номер договора
  contractDate: string; // Дата договора
  paycond: string; // Условие оплаты
  phoneNumber: string; // Номер телефона
}

export interface IMovementHead extends IHead {
  fromDepart: Department;
  toDepart: Department; //Подразделение
  comment?: string; // Комvентарий
}

export interface IMovementLine extends IEntity {
  good: INamedEntity;
  quantity: number;
  price?: number;
  buyingPrice?: number;
  remains?: number;
  barcode?: string;
  EID?: string;
  docType?: string;
}

export type IMovementDocument = MandateProps<IDocument<IMovementHead, IMovementLine>, 'head' | 'lines'>;

export interface IOrderHead extends IHead {
  contact: INamedEntity; //организация-плательщик
  outlet: INamedEntity; // магазин –подразделение организации плательщика
  route?: INamedEntity; // 	Маршрут
  depart?: INamedEntity; // Необязательное поле склад (подразделение предприятия-производителя)
  onDate: string; //  Дата отгрузки
  takenOrder?: TakeOrderType; //тип взятия заявки
}

export interface IOrderLine extends IEntity {
  good: IGood;
  quantity: number;
  packagekey?: INamedEntity; // Вид упаковки
}

export type IOrderDocument = MandateProps<IDocument<IMovementHead, IMovementLine>, 'head' | 'lines'>;

export type TakeOrderType = 'ON_PLACE' | 'BY_PHONE' | 'BY_EMAIL';

export type AppThunk<ReturnType = void, S = void, A extends AnyAction = AnyAction> = ThunkAction<
  ReturnType,
  S,
  unknown,
  A
>;
