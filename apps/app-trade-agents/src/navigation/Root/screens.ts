import { RouteViewScreen, RouteListScreen, RouteDetailScreen as RouteDetailsScreen } from '../../screens/Routes/';

import {
  OrderEditScreen,
  OrderLineScreen,
  OrderListScreen,
  OrderViewScreen,
  SelectGroupScreen,
} from '../../screens/Orders';

import SelectRefItemScreen from '../../components/SelectRefItemScreen';

import { ContactListScreen, GoodListScreen, GoodLineScreen } from '../../screens/GoodMatrix';
import { DebetListScreen } from '../../screens/Debets';

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

const debetListScreens = {
  DebetList: { title: 'Задолженности', component: DebetListScreen },
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

export { orderListScreens, orderScreens, debetListScreens, routerScreen, goodMatrixListScreens, goodMatrixScreens };
