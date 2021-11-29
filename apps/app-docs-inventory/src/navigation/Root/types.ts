import { INamedEntity } from '@lib/types';

import { IInventoryLine } from '../../store/types';

export type IRefSelectParams = {
  refName: string;
  fieldName: string;
  value?: INamedEntity[];
  clause?: Record<string, string>;
  isMulti?: boolean;
};

export type RefParamList = {
  SelectRefItem: IRefSelectParams;
};

export type DocumentParamList = RefParamList & {
  DocumentView: { id: string };
  DocumentEdit: { id: string } | undefined;
  DocumentLine: { mode: number; docId: string; item: IInventoryLine };
  SelectGroupItem: { docId: string };
  SelectGoodItem: { docId: string; groupId: string };
};

export type DocumentsStackParamList = { DocumentList: undefined } & DocumentParamList;

export type RoutesStackParamList = DocumentParamList & {
  RouteList: undefined;
  RouteView: { id: string };
  RouteDetails: { routeId: string; id: string };
};
