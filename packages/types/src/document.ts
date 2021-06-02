import { IEntity, INamedEntity } from './models';

export type StatusType = 'DRAFT' | 'READY' | 'SENT' | 'PROCESSED';

interface IDocument extends IEntity {
  number: string;
  documentDate: string;
  documentType: INamedEntity;
  status: StatusType;
}

interface IUserDocument<T, K extends IEntity[]> extends IDocument {
  head: T;
  lines: K;
}

export { IDocument, IUserDocument };
