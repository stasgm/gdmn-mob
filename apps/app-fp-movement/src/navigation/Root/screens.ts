import { SelectRefItemScreen } from '../../components/SelectRefItemScreen';

import { MoveListScreen, MoveEditScreen, MoveViewScreen, MoveLineScreen } from '../../screens/Movements';

import ScanBarcodeScreen from '../../screens/Movements/ScanBarcodeScreen';

import {
  OrderListScreen,
  TempViewScreen,
  OrderEditScreen,
  OtvesViewScreen,
  OtvesLineScreen,
} from '../../screens/Orders';

import ScanOrderScreen from '../../screens/Orders/ScanOrderScreen';
import ScanGoodScreen from '../../screens/Orders/ScanGoodScreen';

export const moveScreens = {
  MoveEdit: { title: 'Перемещение', component: MoveEditScreen },
  MoveView: { title: 'Документ', component: MoveViewScreen },
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
  TempView: { title: 'Заявка', component: TempViewScreen },
  OrderEdit: { title: 'Заявка', component: OrderEditScreen },
  OtvesView: { title: 'Отвес', component: OtvesViewScreen },
  OtvesLine: { title: 'Позиция отвеса', component: OtvesLineScreen },
  ScanOrder: { title: 'Сканер', component: ScanOrderScreen },
  ScanGood: { title: 'Сканер', component: ScanGoodScreen },
};

export const orderListScreens = {
  OrderList: { title: 'Заявки', component: OrderListScreen },
};
