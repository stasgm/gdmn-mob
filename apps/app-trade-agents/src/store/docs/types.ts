import { INamedEntity, IEntity, IUserDocument } from '@lib/types';

export type typeTakeOrder = 'ONPLACE' | 'BYPHONE' | 'BYEMAIL';

export type typeVisit = 'ORDER' | 'REFUSE' | 'RETURN';
//Организации
export interface IContact extends INamedEntity {
  externalId: string;
  contractNumber: string; // Номер договора
  contractDate: string; // Дата договора
  paycond: string; // Условие оплаты
  phoneNumber: string; // Номер телефона
}
//Магазины
export interface IOutlet extends INamedEntity {
  externalId: string;
  company: INamedEntity; //организация-плательщик
  address: string; //Адрес разгрузки
  phoneNumber: string; // Номер телефона
  lat: number; // широта
  lon: number; // долгота
}
//Задолженности
export interface IDebt extends IEntity {
  id: string;
  contact: INamedEntity; //организация-плательщик
  ondate: string; //на дату
  saldo: number; //Задолженность
  saldoDebt: number; //Просроченная задолженность
}
//Группы товаров
export interface IGoodGroup extends INamedEntity {
  externalId: string;
  parent?: INamedEntity;
}
// Товары
export interface IGood extends INamedEntity {
  externalId: string;
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
}

//Подразделения-склады
export interface IDepartment extends INamedEntity {
  externalId: string;
}
// Интерфейс для матрицы номенклатур для организаций
export interface INetPrice extends IEntity {
  contact: INamedEntity; // организация
  good: INamedEntity; // ID товара
  pricefso?: number; // цена ФСО
  pricefsn?: number; // цена ФСН
}
interface IOrderHead {
  contact: INamedEntity; //организация-плательщик
  outlet: INamedEntity; // магазин –подразделение организации плательщика
  road?: INamedEntity; // 	Маршрут
  depart?: INamedEntity; // Необязательное поле склад (подразделение предприятия-производителя)
  ondate: string; //  Дата отгрузки
  takenOrder?: typeTakeOrder; //тип взятия заявки
}

export interface IOrderLine extends IEntity {
  good: INamedEntity;
  quantity: number;
  packagekey?: INamedEntity; // Вид упаковки
}

export type IOrderDocument = IUserDocument<IOrderHead, IOrderLine[]>;

interface IRouteHead {
  agent: INamedEntity;
  externalId: IEntity;
}

export interface IRouteLine extends IEntity {
  externalId: IEntity;
  outlet: INamedEntity;
  ordNumber: number; // порядковый номер
  comment?: string;
  visited: boolean;
  result?: typeVisit;
}

export type IRouteDocument = IUserDocument<IRouteHead, IRouteLine[]>;
