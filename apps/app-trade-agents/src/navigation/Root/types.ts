export type OrdersStackParamList = {
  OrderList: undefined;
  OrderView: { id: string } | undefined;
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
