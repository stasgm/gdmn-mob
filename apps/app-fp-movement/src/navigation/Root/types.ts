// import { INamedEntity } from '@lib/types';

import { IReferenceData } from '@lib/types';

import { IMoveLine, ISellbillLine } from '../../store/types';

export type IRefSelectParams = {
  refName: string;
  fieldName: string;
  value?: IReferenceData[];
  clause?: Record<string, string>;
  isMulti?: boolean;
  docType?: string;
  refFieldName?: string;
  descrFieldName?: string;
};

export type RefParamList = {
  SelectRefItem: IRefSelectParams;
};

export type MoveParamList = RefParamList & {
  MoveView: { id: string; docType?: string };
  MoveEdit: { id: string; docType?: string } | undefined; //itemId: string;
  MoveLine: { mode: number; docId: string; item: IMoveLine; docType?: string };
  ScanBarcode: { docId: string; docType?: string };
  // // ScanBarcodeReader: { docId: string; docType?: string };
  MoveLineEdit: {
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

export type MoveStackParamList = { MoveList: undefined } & MoveParamList;

export type SellbillParamList = RefParamList & {
  SellbillLine: { mode: number; docId: string; tempId: string; item: ISellbillLine; docType?: string };
  TempView: { id: string };
  SellbillEdit: { id: string };
  SellbillView: { id: string };
  ScanOrder: { id: string };
  ScanGood: { docId: string; tempId: string; docType?: string };
};

export type SellbillStackParamList = { SellbillList: undefined } & SellbillParamList;

export type FreeSellbillParamList = RefParamList & {
  FreeSellbillView: { id: string; docType?: string };
  FreeSellbillEdit: { id: string; docType?: string } | undefined; //itemId: string;
  FreeSellbillLine: { mode: number; docId: string; item: IMoveLine; docType?: string };
  ScanBarcode: { docId: string; docType?: string };
  // // ScanBarcodeReader: { docId: string; docType?: string };
  FreeSellbillLineEdit: {
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

export type FreeSellbillStackParamList = { FreeSellbillList: undefined } & FreeSellbillParamList;
