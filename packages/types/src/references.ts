import { IEntity } from './common';

interface IReferenceData extends IEntity {
  [fieldName: string]: any;
}

type IRefMetadata<T> = {
  [P in keyof T]?: {
    visible?: boolean;
    sortOrder?: number;
    name?: string;
  };
};

interface IReference<T = IReferenceData> {
  id: string;
  name: string;
  sortOrder?: number;
  description?: string;
  metadata?: IRefMetadata<T>;
  visible?: boolean;
  data: T[];
}

interface IReferences<T = any> {
  [name: string]: IReference<T>;
}

export { IReference, IReferences, IReferenceData, IRefMetadata };
