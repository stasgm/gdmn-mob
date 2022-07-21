// import { INamedEntity } from '@lib/types';

import { IReferenceData } from '@lib/types';

import { IMoveLine, IOtvesLine } from '../../store/types';

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

export type OrderParamList = RefParamList & {
  OtvesLine: { mode: number; docId: string; tempId: string; item: IOtvesLine; docType?: string };
  TempView: { id: string };
  OrderEdit: { id: string };
  OtvesView: { id: string };
  ScanOrder: { id: string };
  ScanGood: { docId: string; tempId: string; docType?: string };
};

export type OrderStackParamList = { OrderList: undefined } & OrderParamList;

export type ShipmentParamList = RefParamList & {
  ShipmentView: { id: string; docType?: string };
  ShipmentEdit: { id: string; docType?: string } | undefined; //itemId: string;
  ShipmentLine: { mode: number; docId: string; item: IMoveLine; docType?: string };
  ScanBarcode: { docId: string; docType?: string };
  // // ScanBarcodeReader: { docId: string; docType?: string };
  ShipmentLineEdit: {
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

export type ShipmentStackParamList = { ShipmentList: undefined } & ShipmentParamList;
