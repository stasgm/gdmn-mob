/* eslint-disable @typescript-eslint/no-empty-interface */
import { IEntity, INamedEntity } from './models';

type statusType = 'DRAFT' | 'READY' | 'SENT' | 'PROCESSED' | 'CHECKED';
interface IDocumentStatus {
  type: statusType;
  errorMessage: string;
}

interface IDocument extends IEntity {
  number: string;
  documentDate: string;
  documentType: INamedEntity;
  status: IDocumentStatus;
}

interface IUserDocument<T, K extends IEntity[]> extends IDocument {
  head: T;
  lines: K;
}

//  Agents

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

export { IDocument };
