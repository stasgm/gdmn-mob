import { INamedEntity } from '@lib/types';

import { IInventoryLine } from '../../store/types';

export type IRefSelectParams = {
  refName: string;
  fieldName: string;
  value?: INamedEntity[];
  clause?: Record<string, string>;
  isMulti?: boolean;
  docType?: string;
  refFieldName?: string;
};

export type RefParamList = {
  SelectRefItem: IRefSelectParams;
};

export type InventoryParamList = RefParamList & {
  InventoryView: { id: string; docType?: string };
  InventoryEdit: { id: string; docType?: string } | undefined; //itemId: string;
  InventoryLine: { mode: number; docId: string; item: IInventoryLine; docType?: string };
  SelectGoodItem: { docId: string; docType?: string };
  SelectRemainsItem: { docId: string; docType?: string };
  ScanBarcode: { docId: string; docType?: string };
  // ScanBarcodeReader: { docId: string; docType?: string };
  InventoryLineEdit: {
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

export type InventoryStackParamList = { InventoryList: undefined } & InventoryParamList;
