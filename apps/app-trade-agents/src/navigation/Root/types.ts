import { INamedEntity } from '@lib/types';

import { IOrderLine, IReturnLine } from '../../store/docs/types';

export type SelectParamList = {
  SelectRefItem: {
    // parentScreen: keyof OrdersStackParamList;
    refName: string;
    fieldName: string;
    value?: INamedEntity[];
    clause?: Record<string, string>;
    isMulti?: boolean;
  };
};

export type NestingOrderParamList = {
  OrderView: { id: string; routeBack?: string } | undefined;
  OrderEdit: { id: string } | undefined;
  OrderLine: { mode: number; docId: string; item: IOrderLine };
  SelectGroupItem: { docId: string };
  SelectGoodItem: { docId: string; groupId: string };
};

type OrdersParamList = {
  OrderList: undefined;
};

export type OrdersStackParamList = OrdersParamList & NestingOrderParamList & SelectParamList;

export type NestingReturnParamList = {
  ReturnView: { id: string; routeBack?: string } | undefined;
  ReturnEdit: { id: string } | undefined;
  ReturnLine: { mode: number; docId: string; item: IReturnLine };
  SelectItemReturn: { docId: string; name: string };
};

type ReturnsParamList = {
  ReturnList: undefined;
};

export type ReturnsStackParamList = ReturnsParamList & NestingReturnParamList & SelectParamList;

export type RoutesParamList = {
  RouteList: undefined;
  RouteView: { id: string };
  RouteDetails: { routeId: string; id: string };
};

export type RoutesStackParamList = RoutesParamList & NestingOrderParamList & NestingReturnParamList & SelectParamList;

export type MapStackParamList = {
  MapGeoView: undefined;
  ListGeoView: undefined;
};
