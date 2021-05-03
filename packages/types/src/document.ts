import { IEntity, INamedEntity } from './models';

interface IDocument extends IEntity {
  number: string;
  documentDate: string;
  documentType: INamedEntity;
}

export { IDocument };
