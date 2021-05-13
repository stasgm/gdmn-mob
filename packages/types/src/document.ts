/* eslint-disable @typescript-eslint/no-empty-interface */
import { IEntity, INamedEntity } from './models';

type StatusType = 'DRAFT' | 'READY' | 'SENT' | 'PROCESSED';

/* interface IDocumentStatus {
  type: statusType;
  errorMessage?: string;
}
 */
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
