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

export type MoveFromParamList = RefParamList & {
  MoveFromView: { id: string; docType?: string };
  MoveFromEdit: { id: string; docType?: string } | undefined;
  ScanGood: { docId: string };
  SelectCell: { docId: string; /*lineId: string;*/ item: IMoveLine; mode: number; docType?: string };
  InventoryView: { id: string; docType?: string };
};

export type MoveFromStackParamList = { MoveFromList: undefined } & MoveFromParamList;

export type MoveToParamList = RefParamList & {
  MoveToView: { id: string; docType?: string };
  MoveToEdit: { id: string; docType?: string } | undefined;
  ScanGood: { docId: string };
  SelectCell: { docId: string; /*lineId: string;*/ item: IMoveLine; mode: number; docType?: string };
  InventoryView: { id: string; docType?: string };
};

export type MoveToStackParamList = { MoveToList: undefined } & MoveToParamList;

export type PrihodParamList = RefParamList & {
  PrihodView: { id: string; docType?: string };
  PrihodEdit: { id: string; docType?: string } | undefined;
  ScanGood: { docId: string };
};

export type PrihodStackParamList = { PrihodList: undefined } & PrihodParamList;

export type ShipmentParamList = RefParamList & {
  ShipmentEdit: { id: string; isShipment: boolean };
  ShipmentView: { id: string; isShipment: boolean };
  ScanOrder: { docTypeId: string; isShipment: boolean };
  ScanGood: { docId: string; isShipment: boolean };
  SelectCell: { docId: string; /*lineId: string;*/ item: IMoveLine; mode?: number; docType?: string };
};

export type ShipmentStackParamList = { ShipmentList: undefined } & ShipmentParamList;

export type CurrShipmentParamList = RefParamList & {
  ShipmentEdit: { id: string; isShipment: boolean };
  ShipmentView: { id: string; isShipment: boolean };
  ScanOrder: { docTypeId: string; isShipment: boolean };
  ScanGood: { docId: string; isShipment: boolean };
};

export type CurrShipmentStackParamList = { CurrShipmentList: undefined } & ShipmentParamList;

export type FreeShipmentParamList = RefParamList & {
  FreeShipmentView: { id: string; isCurr: boolean };
  FreeShipmentEdit: { id?: string; isCurr: boolean }; //itemId: string;
  ScanGood: { docId: string; docType?: string };
};

export type FreeShipmentStackParamList = { FreeShipmentList: undefined } & FreeShipmentParamList;

export type CurrFreeShipmentParamList = RefParamList & {
  FreeShipmentView: { id: string; isCurr: boolean };
  FreeShipmentEdit: { id?: string; isCurr: boolean }; //itemId: string;
  ScanGood: { docId: string; docType?: string };
};

export type CurrFreeShipmentStackParamList = { CurrFreeShipmentList: undefined } & FreeShipmentParamList;

export type ReturnParamList = RefParamList & {
  ReturnView: { id: string; docType?: string };
  ReturnEdit: { id: string; docType?: string } | undefined; //itemId: string;
  ScanGood: { docId: string; docType?: string };
};

export type ReturnStackParamList = { ReturnList: undefined } & ReturnParamList;

export type LaboratoryParamList = RefParamList & {
  LaboratoryView: { id: string; docType?: string };
  LaboratoryEdit: { id: string; docType?: string } | undefined; //itemId: string;
  ScanGood: { docId: string; docType?: string };
};

export type LaboratoryStackParamList = { LaboratoryList: undefined } & LaboratoryParamList;

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

export type RemainsParamList = RefParamList & {
  GoodList: { id: string };
  GoodLine: { item: any };
};

export type RemainsStackParamList = { ContactList: undefined } & RemainsParamList;
