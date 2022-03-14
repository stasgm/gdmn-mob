import { IReferenceData } from '@lib/types';

import { IMovementLine } from '../../store/types';

export type IRefSelectParams = {
  refName: string;
  fieldName: string;
  value?: IReferenceData[];
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
  InventoryLine: { mode: number; docId: string; item: IMovementLine; docType?: string };
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

export type DocParamList = RefParamList & {
  DocView: { id: string; docType?: string };
  DocEdit: { id: string; docType?: string } | undefined; //itemId: string;
  DocLine: { mode: number; docId: string; item: IMovementLine; docType?: string };
  SelectGoodItem: { docId: string; docType?: string };
  SelectRemainsItem: { docId: string; docType?: string };
  ScanBarcode: { docId: string; docType?: string };
  // // ScanBarcodeReader: { docId: string; docType?: string };
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

export type RemainsParamList = RefParamList & {
  GoodList: { id: string };
  GoodLine: { item: any /*IMatrixDataNamed*/ };
};

export type RemainsStackParamList = { ContactList: undefined } & RemainsParamList;
