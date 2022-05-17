import { INamedEntity } from '@lib/types';

import { IDocLine } from '../../store/types';

export type IRefSelectParams = {
  refName: string;
  fieldName: string;
  value?: INamedEntity[];
  clause?: Record<string, string>;
  isMulti?: boolean;
  docType?: string;
};

export type RefParamList = {
  SelectRefItem: IRefSelectParams;
};

export type DocParamList = RefParamList & {
  DocView: { id: string; docType?: string };
  DocEdit: { id: string; docType?: string } | undefined;
  DocLine: { mode: number; docId: string; item: IDocLine; docType?: string };
  SelectGoodItem: { docId: string; docType?: string };
  SelectRemainsItem: { docId: string; docType?: string };
  ScanBarcode: { docId: string; docType?: string };
  DocLineEdit: {
    docId: string;
    prodId: string;
    quantity?: number;
    lineId?: number;
    price?: number;
    remains?: number;
    modeCor?: boolean;
    docType?: string;
  };
};

export type DocStackParamList = { DocList: undefined } & DocParamList;
