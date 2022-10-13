import { RouteViewScreen, RouteListScreen, VisitScreen } from '../../screens/Routes/';

import { OrderEditScreen, OrderListScreen, OrderViewScreen, SelectGoodScreen } from '../../screens/Orders';

import SelectRefItemScreen from '../../components/SelectRefItemScreen';

import { ContactListScreen, GoodListScreen, GoodLineScreen } from '../../screens/GoodMatrix';
import { DebetListScreen } from '../../screens/Debets';

const orderListScreens = {
  OrderList: { title: 'Заявки', component: OrderListScreen },
};

const orderScreens = {
  OrderView: { title: 'Заявка', component: OrderViewScreen },
  OrderEdit: { title: 'Заявка', component: OrderEditScreen },
  SelectGood: { title: 'Выбор товара', component: SelectGoodScreen },
  SelectRefItem: { title: 'Выбор из справочника', component: SelectRefItemScreen },
};

const debetListScreens = {
  DebetList: { title: 'Задолженности', component: DebetListScreen },
};

const routerScreen = {
  RouteList: { title: 'Маршруты', component: RouteListScreen },
  RouteView: { title: 'Точки маршрута', component: RouteViewScreen },
  Visit: { title: 'Визит', component: VisitScreen },
};

const goodMatrixListScreens = {
  ContactList: { title: 'Матрицы', component: ContactListScreen },
};

const goodMatrixScreens = {
  GoodList: { title: 'Матрица', component: GoodListScreen },
  GoodLine: { title: 'Позиция матрицы', component: GoodLineScreen },
};

export { orderListScreens, orderScreens, debetListScreens, routerScreen, goodMatrixListScreens, goodMatrixScreens };
