import { SelectRefItemScreen } from '../../components/SelectRefItemScreen';

import { MoveListScreen, MoveEditScreen, MoveViewScreen, MoveLineScreen } from '../../screens/Movements';

import ScanBarcodeScreen from '../../screens/Movements/ScanBarcodeScreen';

import { OrderListScreen, OrderViewScreen, OrderEditScreen, OtvesViewScreen } from '../../screens/Orders';

import ScanOrderScreen from '../../screens/Orders/ScanOrderScreen';

export const moveScreens = {
  MoveEdit: { title: 'Перемещение', component: MoveEditScreen },
  MoveView: { title: 'Перемещение', component: MoveViewScreen },
  MoveLine: { title: 'Позиция перемещения', component: MoveLineScreen },
  SelectRefItem: { title: 'Выбор из справочника', component: SelectRefItemScreen },
  ScanBarcode: { title: 'Сканер', component: ScanBarcodeScreen },
  //
  // ScanBarcodeReader: ScanBarcodeReaderScreen,
};

export const moveListScreens = {
  MoveList: { title: 'Перемещение', component: MoveListScreen },
};

export const orderScreens = {
  OrderView: { title: 'Заявка', component: OrderViewScreen },
  OrderEdit: { title: 'Заявка', component: OrderEditScreen },
  OtvesView: { title: 'Заявка', component: OtvesViewScreen },
  ScanOrder: { title: 'Сканер', component: ScanOrderScreen },
};

export const orderListScreens = {
  OrderList: { title: 'Заявки', component: OrderListScreen },
};
