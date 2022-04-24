import { IEntity, INamedEntity, StatusType } from './common';

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

type DocfMetadata<T, K> = {
  head?: Meta<T>;
  lines?: Meta<K>;
};

export interface IHead {
  [fieldname: string]: any;
}

//TODO: Расширили тип для инвентаризации, надо разделить */
export interface IDocumentType extends INamedEntity {
  description?: string;
  isRemains?: boolean;
  remainsField?: string;
  fromDescription?: string;
  fromType?: string;
  fromRequired?: boolean;
  toDescription?: string;
  toType?: string;
  toRequired?: boolean;
  sortOrder?: number;
}

interface IDocument<T = IHead, K extends IEntity = IEntity> extends IEntity {
  number: string;
  documentDate: string;
  documentType: IDocumentType;
  status: StatusType;
  metadata?: DocfMetadata<T, K>;
  errorMessage?: string;
  head?: T;
  lines?: K[];
}

type MandateProps<T extends IEntity, K extends keyof T> = Omit<T, K> & {
  [MK in K]-?: NonNullable<T[MK]>;
};

export type IDepartment = INamedEntity;

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
export { IDocument, DocfMetadata as IDocfMetadata, MandateProps };
