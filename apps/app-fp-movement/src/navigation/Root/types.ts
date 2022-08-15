// import { INamedEntity } from '@lib/types';

import { IReferenceData } from '@lib/types';

import { IMoveLine, IShipmentLine } from '../../store/types';

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

export type ShipmentParamList = RefParamList & {
  ShipmentLine: { mode: number; docId: string; tempId: string; item: IShipmentLine; docType?: string };
  TempView: { id: string };
  ShipmentEdit: { id: string };
  ShipmentView: { id: string };
  ScanOrder: { docTypeId: string };
  ScanGood: { docId: string };
};

export type ShipmentStackParamList = { ShipmentList: undefined } & ShipmentParamList;

export type FreeShipmentParamList = RefParamList & {
  FreeShipmentView: { id: string; docType?: string };
  FreeShipmentEdit: { id: string; docType?: string } | undefined; //itemId: string;
  FreeShipmentLine: { mode: number; docId: string; item: IMoveLine; docType?: string };
  ScanBarcode: { docId: string; docType?: string };
};

export type FreeShipmentStackParamList = { FreeShipmentList: undefined } & FreeShipmentParamList;
