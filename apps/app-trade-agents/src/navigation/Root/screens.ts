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
  ReturnSellBillScreen,
} from '../../screens/Returns';

import SelectRefItemScreen from '../../components/SelectRefItemScreen';

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
  ReturnSellBill: ReturnSellBillScreen,
};

const routerScreen = {
  RouteList: RouteListScreen,
  RouteView: RouteViewScreen,
  RouteDetails: RouteDetailsScreen,
};

export { orderListScreens, orderScreens, returnListScreens, returnScreens, routerScreen };
