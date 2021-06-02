import { IListItem } from '@lib/mobile-types';

import { IOrderLine } from '../../store/docs/types';

export type OrdersStackParamList = {
  OrderList: undefined;
  OrderView: { id: string } | undefined;
  OrderLine: { docId: string; item: IOrderLine | undefined };
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
