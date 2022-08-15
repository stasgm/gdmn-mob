import { SelectRefItemScreen } from '../../components/SelectRefItemScreen';

import { MoveListScreen, MoveEditScreen, MoveViewScreen, MoveLineScreen } from '../../screens/Movements';

import ScanBarcodeScreen from '../../screens/Movements/ScanBarcodeScreen';

import {
  ShipmentListScreen,
  ShipmentEditScreen,
  ShipmentViewScreen,
  ScanOrderScreen,
  ScanGoodScreen,
} from '../../screens/Shipment';

import {
  FreeShipmentListScreen,
  FreeShipmentEditScreen,
  FreeShipmentViewScreen,
  FreeShipmentLineScreen,
} from '../../screens/FreeShipment';

export const moveScreens = {
  MoveEdit: { title: 'Перемещение', component: MoveEditScreen },
  MoveView: { title: 'Перемещение', component: MoveViewScreen },
  MoveLine: { title: 'Позиция перемещения', component: MoveLineScreen },
  SelectRefItem: { title: 'Выбор из справочника', component: SelectRefItemScreen },
  ScanBarcode: { title: 'Сканер', component: ScanBarcodeScreen },
};

export const moveListScreens = {
  MoveList: { title: 'Перемещение', component: MoveListScreen },
};

export const shipmentScreens = {
  ShipmentEdit: { title: 'Отвес по заявке', component: ShipmentEditScreen },
  ShipmentView: { title: 'Отвес', component: ShipmentViewScreen },
  ScanOrder: { title: 'Сканер заявки', component: ScanOrderScreen },
  ScanGood: { title: 'Сканер товара', component: ScanGoodScreen },
};

export const shipmentListScreens = {
  ShipmentList: { title: 'Отвесы по заявке', component: ShipmentListScreen },
};

export const freeShipmentScreens = {
  FreeShipmentEdit: { title: 'Отвес', component: FreeShipmentEditScreen },
  FreeShipmentView: { title: 'Отвес', component: FreeShipmentViewScreen },
  FreeShipmentLine: { title: 'Позиция отвеса', component: FreeShipmentLineScreen },
  SelectRefItem: { title: 'Выбор из справочника', component: SelectRefItemScreen },
  ScanBarcode: { title: 'Сканер', component: ScanBarcodeScreen },
};

export const freeShipmentListScreens = {
  FreeShipmentList: { title: 'Отвесы', component: FreeShipmentListScreen },
};
