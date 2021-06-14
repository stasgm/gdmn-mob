import { INamedEntity } from '@lib/types';

import { IOrderLine, IReturnLine } from '../../store/docs/types';

export type OrdersStackParamList = {
  OrderList: undefined;
  OrderView: { id: string; routeBack?: string } | undefined;
  OrderEdit: { id: string } | undefined;
  OrderLine: { mode: number; docId: string; item: IOrderLine };
  SelectRefItem: {
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
  ReturnView: { id: string; routeBack?: string } | undefined;
  ReturnEdit: { id: string } | undefined;
  ReturnLine: { mode: number; docId: string; item: IReturnLine };
  SelectRefItem: {
    parentScreen: keyof ReturnsStackParamList;
    refName: string;
    fieldName: string;
    value: INamedEntity[];
    clause?: Record<string, string>;
    isMulti?: boolean;
  };
  SelectItemReturn: { docId: string; name: string };
};

export type RoutesStackParamList = {
  RouteList: undefined;
  RouteView: { id: string };
  RouteDetails: { routeId: string; id: string };
  OrderView: { id: string; routeBack?: string } | undefined;
  OrderLine: { mode: number; docId: string; item: IOrderLine };
  SelectGroupItem: { docId: string };
  SelectGoodItem: { docId: string; groupId: string };
  SelectRefItem: {
    parentScreen: keyof RoutesStackParamList;
    refName: string;
    fieldName: string;
    value: INamedEntity[];
    clause?: Record<string, string>;
    isMulti?: boolean;
  };
  ReturnView: { id: string; routeBack?: string } | undefined;
  ReturnLine: { mode: number; docId: string; item: IReturnLine };
  SelectItemReturn: { docId: string; name: string };
};

export type MapStackParamList = {
  MapGeoView: undefined;
  ListGeoView: undefined;
};
