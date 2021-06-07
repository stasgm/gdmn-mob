import { IOrderLine } from '../../store/docs/types';

export type OrdersStackParamList = {
  OrderList: undefined;
  OrderView: { id: string } | undefined;
  OrderLine: { mode: number; docId: string; item: IOrderLine };
  SelectItem: { docId: string; name: string };
};

export type ReturnsStackParamList = {
  ReturnList: undefined;
  ReturnView: { id: string } | undefined;
  ReturnLine: { mode: number; docId: string; item: IOrderLine };
  SelectItem: { docId: string; name: string };
};

export type RoutesStackParamList = {
  RouteList: undefined;
  RouteView: { id: string };
  RouteDetails: { routeId: string; id: string };
};

export type MapStackParamList = {
  MapGeoView: undefined;
  ListGeoView: undefined;
};
