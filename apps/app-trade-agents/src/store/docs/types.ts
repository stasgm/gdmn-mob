import { INamedEntity, IEntity, IUserDocument, IDocument } from '@lib/types';

//  orders

interface IOrderHead {
  contact: INamedEntity; //организация-плательщик
  outlet: INamedEntity; // магазин –подразделение организации плательщика
  road?: INamedEntity; // 	Маршрут
  depart?: INamedEntity; // Необязательное поле склад (подразделение предприятия-производителя)
  ondate: string; //  Дата отгрузки
}

interface IOrderLine extends IEntity {
  good: INamedEntity;
  quantity: number;
  packagekey?: INamedEntity; // Вид упаковки
}

export type IOrderDocument = IUserDocument<IOrderHead, IOrderLine[]>;

interface IRouteHead {
  agent: INamedEntity;
}

interface IRouteLine extends IEntity {
  outlet: INamedEntity;
  ordNumber: number; // порядковый номер
  comment?: string;
  visited: boolean;
}

export type IRouteDocument = IUserDocument<IRouteHead, IRouteLine[]>;

export type IDocState = {
  readonly docData: IOrderDocument[] | undefined;
  readonly loading: boolean;
  readonly errorMessage: string;
};

export type IDocPayload = Partial<{
  errorMessage: string;
  docData: IDocument[];
}>;
