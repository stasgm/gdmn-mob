import { RouteViewScreen, RouteListScreen, RouteDetailScreen as RouteDetailsScreen } from '../../screens/Routes/';

import {
  OrderEditScreen,
  OrderLineScreen,
  OrderListScreen,
  OrderViewScreen,
  SelectGoodScreen,
  SelectGroupScreen,
} from '../../screens/Orders';

import {
  ReturnLineScreen,
  ReturnViewScreen,
  ReturnEditScreen,
  SelectItemScreen,
  ReturnListScreen,
  SellBillScreen,
} from '../../screens/Returns';

import SelectRefItemScreen from '../../components/SelectRefItemScreen';

import { ContactListScreen, GoodsListScreen, GoodLineScreen } from '../../screens/GoodMatrix';

const orderListScreens = {
  OrderList: OrderListScreen,
};

const orderScreens = {
  OrderView: OrderViewScreen,
  OrderEdit: OrderEditScreen,
  OrderLine: OrderLineScreen,
  SelectGroupItem: SelectGroupScreen,
  SelectGoodItem: SelectGoodScreen,
  SelectRefItem: SelectRefItemScreen,
};

const returnListScreens = {
  ReturnList: ReturnListScreen,
};

const returnScreens = {
  ReturnView: ReturnViewScreen,
  ReturnEdit: ReturnEditScreen,
  ReturnLine: ReturnLineScreen,
  SelectRefItem: SelectRefItemScreen,
  SelectItemReturn: SelectItemScreen,
  SellBill: SellBillScreen,
};

const routerScreen = {
  RouteList: RouteListScreen,
  RouteView: RouteViewScreen,
  RouteDetails: RouteDetailsScreen,
};

const goodMatrixListScreens = {
  ContactList: ContactListScreen,
};

const goodMatrixScreens = {
  GoodsList: GoodsListScreen,
  GoodLine: GoodLineScreen,
};

export {
  orderListScreens,
  orderScreens,
  returnListScreens,
  returnScreens,
  routerScreen,
  goodMatrixListScreens,
  goodMatrixScreens,
};
