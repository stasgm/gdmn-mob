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

export type InventoryParamList = RefParamList & {
  InventoryView: { id: string };
  InventoryEdit: { id: string } | undefined;
  InventoryLine: { mode: number; docId: string; item: IInventoryLine };
  SelectGroupItem: { docId: string };
  SelectGoodItem: { docId: string }; //group Id
};

export type InventorysStackParamList = { InventoryList: undefined } & InventoryParamList;

export type RoutesStackParamList = InventoryParamList & {
  RouteList: undefined;
  RouteView: { id: string };
  RouteDetails: { routeId: string; id: string };
};
