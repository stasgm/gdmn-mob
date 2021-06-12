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
    title: string;
    isMulti?: boolean;
    value: INamedEntity[];
  };
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
  SelectItem: { docId: string; name: string };
  ReturnView: { id: string } | undefined;
  ReturnLine: { mode: number; docId: string; item: IReturnLine };
  SelectItemReturn: { docId: string; name: string };
};

export type MapStackParamList = {
  MapGeoView: undefined;
  ListGeoView: undefined;
};
