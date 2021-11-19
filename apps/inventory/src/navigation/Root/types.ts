import { INamedEntity } from '@lib/types';

import { IOrderLine, IReturnLine, ISellBillLine } from '../../store/types'; // ??

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
  OrderView: { id: string };
  DocumentEdit: { id: string } | undefined;
  OrderLine: { mode: number; docId: string; item: IOrderLine };
  SelectGroupItem: { docId: string };
  SelectGoodItem: { docId: string; groupId: string };
};

export type DocumentsStackParamList = { OrderList: undefined } & DocumentParamList;

export type ReturnParamList = RefParamList & {
  ReturnView: { id: string };
  ReturnEdit: { id: string } | undefined;
  ReturnLine: { mode: number; docId: string; item: IReturnLine };
  SelectItemReturn: { docId: string; name: string };
  SellBill: { id: string } | undefined;
  SellBillLine: { mode: number; docId?: string; item: ISellBillLine };
};

export type ReturnsStackParamList = { ReturnList: undefined } & ReturnParamList;

export type RoutesStackParamList = DocumentParamList &
  ReturnParamList & {
    RouteList: undefined;
    RouteView: { id: string };
    RouteDetails: { routeId: string; id: string };
  };

export type MapStackParamList = {
  MapGeoView: undefined;
  ListGeoView: undefined;
};
