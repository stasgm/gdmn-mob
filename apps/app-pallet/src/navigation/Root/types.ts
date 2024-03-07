import { IReferenceData } from '@lib/types';

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

export type PalletParamList = RefParamList & {
  PalletView: { id: string; docType?: string };
  PalletGood: { docId: string };
};

export type PalletStackParamList = { PalletList: undefined } & PalletParamList;
