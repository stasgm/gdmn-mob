import { SelectRefItemScreen } from '../../components/SelectRefItemScreen';

import {
  MovementListScreen,
  MovementEditScreen,
  MovementViewScreen,
  MovementLineScreen,
} from '../../screens/Movements';

import ScanBarcodeScreen from '../../screens/Movements/ScanBarcodeScreen';

import { OrderListScreen } from '../../screens/Orders/OrderListScreen';

import ScanOrderScreen from '../../screens/Orders/ScanOrderScreen';

export const movementScreens = {
  MovementEdit: { title: 'Перемещение', component: MovementEditScreen },
  MovementView: { title: 'Перемещение', component: MovementViewScreen },
  MovementLine: { title: 'Позиция перемещения', component: MovementLineScreen },
  SelectRefItem: { title: 'Выбор из справочника', component: SelectRefItemScreen },
  ScanBarcode: { title: 'Сканер', component: ScanBarcodeScreen },
  //
  // ScanBarcodeReader: ScanBarcodeReaderScreen,
};

export const movementListScreens = {
  MovementList: { title: 'Перемещение', component: MovementListScreen },
};

export const orderScreens = {
  ScanOrder: { title: 'Сканер', component: ScanOrderScreen },
};

export const orderListScreens = {
  OrderList: { title: 'Заявки', component: OrderListScreen },
};
