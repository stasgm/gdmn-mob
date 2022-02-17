import { INamedEntity } from '@lib/types';

import { IInventoryLine } from '../../store/types';

export type IRefSelectParams = {
  refName: string;
  fieldName: string;
  value?: INamedEntity[];
  clause?: Record<string, string>;
  isMulti?: boolean;
  docType?: string;
};

export type RefParamList = {
  SelectRefItem: IRefSelectParams;
};

export type MovementParamList = RefParamList & {
  MovementView: { id: string; docType?: string };
  MovementEdit: { id: string; docType?: string } | undefined; //itemId: string;
  InventoryLine: { mode: number; docId: string; item: IInventoryLine; docType?: string };
  ScanBarcode: { docId: string; docType?: string };
  // ScanBarcodeReader: { docId: string; docType?: string };
};

export type MovementStackParamList = { MovementList: undefined } & MovementParamList;
