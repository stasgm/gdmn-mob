import { INamedEntity } from '@lib/types';

import { IInventoryLine } from '../../store/types';

export type IRefSelectParams = {
  refName: string;
  fieldName: string;
  value?: INamedEntity[];
  clause?: Record<string, string>;
  isMulti?: boolean;
};

export type RefParamList = {
  SelectRefItem: IRefSelectParams;
};

export type InventoryParamList = RefParamList & {
  InventoryView: { id: string };
  InventoryEdit: { id: string } | undefined;
  InventoryLine: { mode: number; docId: string; item: IInventoryLine };
  SelectGoodItem: { docId: string };
  SelectRemainsItem: { docId: string };
  ScanBarcode: { docId: string };
  ScanBarcodeReader: { docId: string };
  InventoryLineEdit: {
    docId: string;
    prodId: string;
    quantity?: number;
    lineId?: number;
    price?: number;
    remains?: number;
    modeCor?: boolean;
  };
};

export type InventorysStackParamList = { InventoryList: undefined } & InventoryParamList;
