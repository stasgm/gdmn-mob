import { INamedEntity } from '@lib/types';
export interface IHead {
  number: string;
  doctype: INamedEntity;
  contact: INamedEntity; //организация-плательщик
  outlet: INamedEntity; // магазин –подразделение организации плательщика
  date: string;
  status: number;
  road?: INamedEntity; // 	Маршрут
  depart?: INamedEntity; // Необязательное поле склад (подразделение предприятия-производителя)
  ondate: string; //  Дата отгрузки
  error?: string;
}

export interface ILine {
  id: string;
  good: INamedEntity;
  quantity: number;
  packagekey?: INamedEntity; // Вид упаковки
}

export interface IDocument {
  id: string;
  head: IHead;
  lines: ILine[];
}

export type IDocState = {
  readonly docData: IDocument[] | undefined;
  readonly loading: boolean;
  readonly errorMessage: string;
};

export type IDocPayload = Partial<{
  errorMessage: string;
  docData: IDocument[];
}>;
