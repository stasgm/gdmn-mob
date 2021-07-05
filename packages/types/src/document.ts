import { IEntity, INamedEntity } from './models';

export type StatusType = 'DRAFT' | 'READY' | 'SENT' | 'PROCESSED';

type Meta<T> = {
  [P in keyof T]?: {
    visible?: boolean;
    sortOrder?: number;
    name?: string;
    required?: boolean;
    type?: 'string' | 'date' | 'number' | 'boolean' | 'ref';
    refName?: string;
  };
};

type IDocfMetadata<T, K> = {
  head?: Meta<T>;
  lines?: Meta<K>;
};
export interface IHead {
  [fieldname: string]: unknown;
}

interface IDocument<T = IHead, K extends IEntity = IEntity> extends IEntity {
  number: string;
  documentDate: string;
  documentType: INamedEntity;
  status: StatusType;
  metadata?: IDocfMetadata<T, K>;
  head?: T;
  lines?: K[];
}

type MandateProps<T extends IEntity, K extends keyof T> = Omit<T, K> &
  {
    [MK in K]-?: NonNullable<T[MK]>;
  };

// Examples

// type IOrder = MandateProps<IDocument<IHead, ILine[]>, 'head' | 'lines'>;
// type Omit<T, K extends keyof IDocument> = Pick<T, Exclude<keyof T, K>>;
// export type ISimpleDocument = Omit<IDocument, 'head' | 'lines'>;
/* const g:  ISimpleDocument = {   };

const a: IDocument = {
  id: '1',
  documentDate: '2011-11-11',
  number: '123',
  documentType: { id: '11', name: 'Заказ' },
  status: 'DRAFT',
};

interface ILine extends IEntity {
  name: string;
  quantity: number;
}

const b: IDocument<undefined, ILine[]> = {
  id: '1',
  documentDate: '2011-11-11',
  number: '123',
  documentType: { id: '11', name: 'Заказ' },
  status: 'DRAFT',
  lines: [{ id: '1', name: 'Товар1', quantity: 2 }],
};

interface IHead {
  company: INamedEntity;
}

const c: IDocument<IHead, ILine[]> = {
  id: '1',
  documentDate: '2011-11-11',
  number: '123',
  documentType: { id: '11', name: 'Заказ' },
  status: 'DRAFT',
  head: { company: { id: '1', name: 'Компания' } },
  lines: [{ id: '1', name: 'Товар1', quantity: 2 }],
};
 */
export { IDocument, IDocfMetadata, MandateProps };
