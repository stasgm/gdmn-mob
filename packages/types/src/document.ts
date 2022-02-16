import { IEntity, INamedEntity, StatusType } from './common';

export type Meta<T> = {
  [P in keyof T]?: {
    visible?: boolean;
    sortOrder?: number;
    name?: string;
    required?: boolean;
    type?: FieldType;
    refName?: string;
  };
};

type DocfMetadata<T, K> = {
  head?: Meta<T>;
  lines?: Meta<K>;
};

export interface IHead {
  [fieldname: string]: boolean | string | number | FieldType;
}

// export interface IDocumentType extends INamedEntity {
//   description?: string;
// }

type FieldType = 'string' | 'date' | 'number' | 'boolean' | 'option' | 'ref';

export type DocTypeMeta<T> = {
  [P in keyof T]: {
    visible?: boolean;
    description: string;
    type: FieldType;
    refName?: string;
    sortOrder?: number;
    clearInput?: boolean;
    disabled?: boolean;
    onChangeText?: string;
    required?: boolean;
  };
};

export type DocTypeMetadata<T, K> = {
  head?: DocTypeMeta<T>;
  lines?: DocTypeMeta<K>;
};

interface IDynDocumentType<T = IHead, K extends IEntity = IEntity> extends IDocumentType {
  description?: string;
  metadata?: DocTypeMetadata<T, K>;
  icon?: string;
}

interface IDocumentType extends INamedEntity {
  description?: string;
}

interface IDocument<T = IHead, K extends IEntity = IEntity> extends IEntity {
  [fieldName: string]: string | undefined | IDocumentType | StatusType | DocfMetadata<T, K> | K[];
  number: string;
  documentDate: string;
  documentType: IDocumentType;
  status: StatusType;
  metadata?: DocfMetadata<T, K>;
  errorMessage?: string;
  head?: T;
  lines?: K[];
}

type MandateProps<T extends IEntity, K extends keyof T> = Omit<T, K> &
  {
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
export { IDocument, DocfMetadata, MandateProps, IDocumentType, IDynDocumentType, FieldType };
