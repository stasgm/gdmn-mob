import { INavItem } from '@lib/mobile-navigation';
import { INamedEntity } from '@lib/types';

import { IDocLine } from '../../store/types';

export type IRefSelectParams = {
  refName: string;
  fieldName: string;
  value?: INamedEntity[];
  clause?: Record<string, string>;
  isMulti?: boolean;
  type?: string;
};

export type RefParamList = {
  SelectRefItem: IRefSelectParams;
};

export type DocParamList = RefParamList & {
  DocView: { id: string; type: string };
  DocEdit: { id?: string; type: string }; //itemId: string;
  DocLine: { mode: number; docId: string; item: IDocLine; type?: string };
  SelectGoodItem: { docId: string; type?: string };
  SelectRemainsItem: { docId: string; type?: string };
  ScanBarcode: { docId: string; type?: string };
  // ScanBarcodeReader: { docId: string; type?: string };
  DocLineEdit: {
    docId: string;
    prodId: string;
    quantity?: number;
    lineId?: number;
    price?: number;
    remains?: number;
    modeCor?: boolean;
    type?: string;
  };
};

export type DocStackParamList = { DocList: { type: string } } & DocParamList;
