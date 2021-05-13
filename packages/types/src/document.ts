/* eslint-disable @typescript-eslint/no-empty-interface */
import { IEntity, INamedEntity } from './models';

type statusType = 'DRAFT' | 'READY' | 'SENT' | 'PROCESSED';
interface IDocumentStatus {
  type: statusType;
  errorMessage?: string;
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

export { IDocument, IUserDocument };
