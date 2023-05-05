import { IReferenceData } from '@lib/types';

import { IInventoryLine, IMoveLine } from '../../store/types';

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
  MoveEdit: { id: string; docType?: string } | undefined;
  ScanGood: { docId: string };
  SelectCell: { docId: string; /*lineId: string;*/ item: IMoveLine; mode: number; docType?: string };
  InventoryView: { id: string; docType?: string };
};

export type MoveStackParamList = { MoveList: undefined } & MoveParamList;

export type ShipmentParamList = RefParamList & {
  TempView: { id: string };
  ShipmentEdit: { id: string };
  ShipmentView: { id: string };
  ScanOrder: { docTypeId: string };
  ScanGood: { docId: string };
  SelectCell: { docId: string; /*lineId: string;*/ item: IMoveLine; mode?: number; docType?: string };
};

export type ShipmentStackParamList = { ShipmentList: undefined } & ShipmentParamList;

export type FreeShipmentParamList = RefParamList & {
  FreeShipmentView: { id: string; docType?: string };
  FreeShipmentEdit: { id: string; docType?: string } | undefined; //itemId: string;
  ScanGood: { docId: string; docType?: string };
};

export type FreeShipmentStackParamList = { FreeShipmentList: undefined } & FreeShipmentParamList;

export type InventoryParamList = RefParamList & {
  InventoryView: { id: string; docType?: string };
  InventoryEdit: { id: string; docType?: string } | undefined; //itemId: string;
  ScanGood: { docId: string; docType?: string };
  SelectCell: { docId: string; /*lineId: string;*/ item: IInventoryLine; mode?: number; docType?: string };
};

export type InventoryStackParamList = { InventoryList: undefined } & InventoryParamList;

export type CellsParamList = RefParamList & {
  CellsView: { id: string };
  GoodLine: { item: any };
};

export type CellsStackParamList = { ContactList: undefined } & CellsParamList;
