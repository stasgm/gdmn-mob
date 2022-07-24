import { RouteViewScreen, RouteListScreen, RouteDetailScreen as RouteDetailsScreen } from '../../screens/Routes/';

import {
  OrderEditScreen,
  OrderLineScreen,
  OrderListScreen,
  OrderViewScreen,
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

import { ContactListScreen, GoodListScreen, GoodLineScreen } from '../../screens/GoodMatrix';

const orderListScreens = {
  OrderList: { title: 'Заявки', component: OrderListScreen },
};

const orderScreens = {
  OrderView: { title: 'Заявка', component: OrderViewScreen },
  OrderEdit: { title: 'Заявка', component: OrderEditScreen },
  OrderLine: { title: 'Позиция заявки', component: OrderLineScreen },
  SelectGroupItem: { title: 'Выбор товара', component: SelectGroupScreen },
  SelectRefItem: { title: 'Выбор из справочника', component: SelectRefItemScreen },
};

const returnListScreens = {
  ReturnList: { title: 'Возвраты', component: ReturnListScreen },
};

const returnScreens = {
  ReturnView: { title: 'Возврат', component: ReturnViewScreen },
  ReturnEdit: { title: 'Возврат', component: ReturnEditScreen },
  ReturnLine: { title: 'Позиция возврата', component: ReturnLineScreen },
  SelectRefItem: { title: 'Выбор из справочника', component: SelectRefItemScreen },
  SelectItemReturn: { title: 'Выбор товара', component: SelectItemScreen },
  SellBill: { title: 'Выбор товара', component: SellBillScreen },
};

const routerScreen = {
  RouteList: { title: 'Маршруты', component: RouteListScreen },
  RouteView: { title: 'Точки маршрута', component: RouteViewScreen },
  RouteDetails: { title: 'Визит', component: RouteDetailsScreen },
};

const goodMatrixListScreens = {
  ContactList: { title: 'Матрицы', component: ContactListScreen },
};

const goodMatrixScreens = {
  GoodList: { title: 'Матрица', component: GoodListScreen },
  GoodLine: { title: 'Позиция матрицы', component: GoodLineScreen },
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
