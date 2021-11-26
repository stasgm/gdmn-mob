import { INamedEntity, IEntity, IDocument, MandateProps, IHead, IReferenceData } from '@lib/types';

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
  depart?: IContact; // Поле склад
  department?: IDepartment; //Подразделение
  comment?: string; // Комvентарий
}

export interface IInventoryLine extends IEntity {
  good: INamedEntity;
  quantity: number;
}

export type IInventoryDocument = MandateProps<IDocument<IInventoryHead, IInventoryLine>, 'head' | 'lines'>;
