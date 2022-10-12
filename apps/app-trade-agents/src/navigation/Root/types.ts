import { IReferenceData } from '@lib/types';

import { IGood, IOrderLine } from '../../store/types';

export type IRefSelectParams = {
  refName: string;
  fieldName: string;
  value?: IReferenceData[];
  clause?: Record<string, string>;
  isMulti?: boolean;
  refFieldName?: string;
  descrFieldName?: string;
};

export type RefParamList = {
  SelectRefItem: IRefSelectParams;
};

export type OrderParamList = RefParamList & {
  OrderView: { id: string; routeId?: string };
  OrderEdit: { id: string; routeId?: string } | undefined;
  OrderLine: { mode: number; docId: string; item: IOrderLine };
  SelectGood: { docId: string };
};

export type OrdersStackParamList = { OrderList: undefined } & OrderParamList;

export type RoutesStackParamList = OrderParamList & {
  RouteList: undefined;
  RouteView: { id: string };
  RouteDetails: { routeId: string; id: string };
};

export type MapStackParamList = {
  MapGeoView: undefined;
  ListGeoView: undefined;
};

export type GoodMatrixParamList = {
  GoodList: { id: string };
  GoodLine: { item: IGood };
};

export type GoodMatrixStackParamList = { ContactList: undefined } & GoodMatrixParamList;

export type DebetStackParamList = {
  DebetList: undefined;
};
