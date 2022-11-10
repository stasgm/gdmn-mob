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
  InventoryEdit: { id: string; docType?: string } | undefined;
  InventoryLine: { mode: number; docId: string; item: IMovementLine; docType?: string };
  SelectGoodItem: { docId: string; docType?: string };
  SelectRemainsItem: { docId: string; docType?: string };
  ScanBarcode: { docId: string; docType?: string };
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
  DocEdit: { id: string; docType?: string } | undefined;
  DocLine: { mode: number; docId: string; item: IMovementLine; docType?: string };
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

export type RemainsParamList = RefParamList & {
  GoodList: { id: string };
  GoodLine: { item: any };
};

export type RemainsStackParamList = { ContactList: undefined } & RemainsParamList;

export type ScanParamList = RefParamList & {
  ScanView: { id: string; docType?: string };
  ScanEdit: { id: string; docType?: string } | undefined; //itemId: string;
  ScanGood: { docId: string };
};

export type ScanStackParamList = { ScanList: undefined } & ScanParamList;
