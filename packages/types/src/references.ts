import { IEntity } from './models';

interface IReferenceData extends IEntity {
  [fieldName: string]: unknown;
}

type IRefMetadata<T> = {
  [P in keyof T]?:
    | {
        sortOrder?: number;
        visible?: true;
        name: string;
      }
    | {
        sortOrder?: never;
        visible: false;
        name?: never;
      };
};

interface IReference<T = IReferenceData> {
  id: string;
  name: string;
  description?: string;
  metadata?: IRefMetadata<T>;
  visible?: boolean;
  data: T[];
}

interface IReferences<T = any> {
  [name: string]: IReference<T>;
}

export { IReference, IReferences, IReferenceData, IRefMetadata };

/* interface IDepartment extends INamedEntity {
  company: INamedEntity;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IPeople extends INamedEntity {
  company?: INamedEntity;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ICompany extends INamedEntity { }
 */
