import { INamedEntity } from '@lib/types';

import { IOrderLine, IReturnLine } from '../../store/docs/types';

export type OrdersStackParamList = {
  OrderList: undefined;
  OrderView: { id: string } | undefined;
  OrderEdit: { id: string } | undefined;
  OrderLine: { mode: number; docId: string; item: IOrderLine };
  SelectItem: {
    parentScreen: keyof OrdersStackParamList;
    refName: string;
    fieldName: string;
    value: INamedEntity[];
    clause?: Record<string, string>;
    isMulti?: boolean;
  };
  SelectGroupItem: { docId: string };
  SelectGoodItem: { docId: string; groupId: string };
};

export type ReturnsStackParamList = {
  ReturnList: undefined;
  ReturnView: { id: string } | undefined;
  ReturnLine: { mode: number; docId: string; item: IReturnLine };
  SelectItem: { docId: string; name: string };
};

export type RoutesStackParamList = {
  RouteList: undefined;
  RouteView: { id: string };
  RouteDetails: { routeId: string; id: string };
  OrderView: { id: string } | undefined;
  OrderLine: { mode: number; docId: string; item: IOrderLine };
  SelectGroupItem: { docId: string };
  SelectGoodItem: { docId: string; groupId: string };
  SelectItem: { docId: string; name: string };
  ReturnView: { id: string } | undefined;
  ReturnLine: { mode: number; docId: string; item: IReturnLine };
  SelectItemReturn: { docId: string; name: string };
};

export type MapStackParamList = {
  MapGeoView: undefined;
  ListGeoView: undefined;
};
