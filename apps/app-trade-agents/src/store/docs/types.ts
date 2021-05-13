import { INamedEntity, IEntity, IUserDocument } from '@lib/types';

//  orders

interface IOrderHead {
  shop: INamedEntity;
}

interface IOrderLine extends IEntity {
  good: INamedEntity;
  qty: number;
}

type IOrderDocument = IUserDocument<IOrderHead, IOrderLine[]>;

interface IRouteHead {
  agent: INamedEntity;
}

interface IRouteLine extends IEntity {
  outlet: INamedEntity;
  ordNumber: number; // порядковый номер
  comment?: string;
  visited: boolean;
}

type IRouteDocument = IUserDocument<IRouteHead, IRouteLine[]>;

const newDoc: IOrderDocument = {
  id: '11',
  number: '33',
  documentDate: '333',
  documentType: {
    id: 'dd',
    name: 'ddd',
  },
  status: {
    type: 'DRAFT',
    errorMessage: '',
  },
  head: {
    shop: {
      id: '11',
      name: 'Мгазин 1',
    },
  },
  lines: [
    {
      id: '11',
      good: {
        id: '11',
        name: 'Мясо',
      },
      qty: 10,
    },
  ],
};

//  Route

const newRouteDoc: IRouteDocument = {
  id: '30506',
  number: '34',
  documentDate: '9579457',
  documentType: {
    id: '33',
    name: 'route',
  },
  status: {
    type: 'DRAFT',
    errorMessage: '',
  },
  head: {
    agent: {
      id: '111111',
      name: 'петров',
    },
  },
  lines: [
    {
      id: '468',
      outlet: {
        id: '5839',
        name: 'рога и копыта маг № 89',
      },
      ordNumber: 3,
      visited: true,
    },
  ],
};
// export interface IHead {
//   number: string;
//   doctype: INamedEntity;
//   contact: INamedEntity; //организация-плательщик
//   outlet: INamedEntity; // магазин –подразделение организации плательщика
//   date: string;
//   status: number;
//   road?: INamedEntity; // 	Маршрут
//   depart?: INamedEntity; // Необязательное поле склад (подразделение предприятия-производителя)
//   ondate: string; //  Дата отгрузки
//   error?: string;
// }

// export interface ILine {
//   id: string;
//   good: INamedEntity;
//   quantity: number;
//   packagekey?: INamedEntity; // Вид упаковки
// }

// export interface IDocument {
//   id: string;
//   head: IHead;
//   lines: ILine[];
// }

// export type IDocState = {
//   readonly docData: IDocument[] | undefined;
//   readonly loading: boolean;
//   readonly errorMessage: string;
// };

// export type IDocPayload = Partial<{
//   errorMessage: string;
//   docData: IDocument[];
// }>;
