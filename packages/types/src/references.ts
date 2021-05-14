import { IEntity } from './models';

interface IReferenceData extends IEntity {
  [fieldName: string]: unknown;
}

interface IReference<T = IReferenceData> {
  id: string;
  name: string;
  description?: string;
  data: T[];
}

interface IReferences {
  [name: string]: IReference;
}

export { IReference, IReferenceData, IReferences };

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
