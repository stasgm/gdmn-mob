// import { INamedEntity } from '@lib/types';
import { ICodeEntity } from '../../store/app/types';

import { IMoveLine } from '../../store/types';

export type IRefSelectParams = {
  refName: string;
  fieldName: string;
  value?: ICodeEntity[];
  clause?: Record<string, string>;
  isMulti?: boolean;
  docType?: string;
  refFieldName?: string;
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
  OrderView: { id: string };
  OrderEdit: { id: string };
  OtvesView: { id: string };
  ScanOrder: { docId?: string; docType?: string };
};

export type OrderStackParamList = { OrderList: undefined } & OrderParamList;
