import { IDocumentType, StatusType } from '@lib/types';

import { IDepartment, IContact } from '../types';

export interface IFormParam {
  [fieldName: string]: unknown;
}

export interface IInventoryFormParam extends IFormParam {
  number?: string;
  onDate?: string;
  status?: StatusType;
  documentType?: IDocumentType;
  depart?: IContact;
  department?: IDepartment;
  comment?: string;
}
