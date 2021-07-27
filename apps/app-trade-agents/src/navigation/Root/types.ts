import { INamedEntity } from '@lib/types';

import { IOrderLine, IReturnLine } from '../../store/docs/types';

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

export type OrderParamList = RefParamList & {
  OrderView: { id: string; routeBack?: string };
  OrderEdit: { id: string } | undefined;
  OrderLine: { mode: number; docId: string; item: IOrderLine };
  SelectGroupItem: { docId: string };
  SelectGoodItem: { docId: string; groupId: string };
};

export type OrdersStackParamList = { OrderList: undefined } & OrderParamList;

export type ReturnParamList = {
  ReturnView: { id: string; routeBack?: string } | undefined;
  ReturnEdit: { id: string } | undefined;
  ReturnLine: { mode: number; docId: string; item: IReturnLine };
  SelectItemReturn: { docId: string; name: string };
};

export type ReturnsStackParamList = { ReturnList: undefined } & ReturnParamList;

export type RoutesStackParamList = OrderParamList &
  ReturnParamList & {
    RouteList: undefined;
    RouteView: { id: string };
    RouteDetails: { routeId: string; id: string };
  };

export type MapStackParamList = {
  MapGeoView: undefined;
  ListGeoView: undefined;
};
