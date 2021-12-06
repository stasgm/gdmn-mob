import { IDocumentType, StatusType } from '@lib/types';

import { IDepartment, IContact } from '../types';

export interface IFormParam {
  [fieldName: string]: unknown;
}

export interface IInventoryFormParam extends IFormParam {
  number?: string;
  documentDate?: string;
  onDate?: string;
  status?: StatusType;
  documentType?: IDocumentType;
  depart?: IContact;
  contact?: IDepartment;
  comment?: string;
}
