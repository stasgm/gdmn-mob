import { MoveListScreen, MoveEditScreen, MoveViewScreen } from '../../screens/Movements';

import {
  ShipmentListScreen,
  ShipmentEditScreen,
  ShipmentViewScreen,
  ScanOrderScreen,
  ScanGoodScreen,
} from '../../screens/Shipment';

import { FreeShipmentListScreen, FreeShipmentEditScreen, FreeShipmentViewScreen } from '../../screens/FreeShipment';
import { SelectRefItemScreen } from '../../components';

export const moveScreens = {
  MoveEdit: { title: 'Перемещение', component: MoveEditScreen },
  MoveView: { title: 'Перемещение', component: MoveViewScreen },
  SelectRefItem: { title: 'Выбор из справочника', component: SelectRefItemScreen },
  ScanGood: { title: 'Сканер', component: ScanGoodScreen },
};

export const moveListScreens = {
  MoveList: { title: 'Перемещение', component: MoveListScreen },
};

export const shipmentScreens = {
  ShipmentEdit: { title: 'Отвес по заявке', component: ShipmentEditScreen },
  ShipmentView: { title: 'Отвес', component: ShipmentViewScreen },
  ScanOrder: { title: 'Сканер заявки', component: ScanOrderScreen },
  ScanGood: { title: 'Сканер', component: ScanGoodScreen },
};

export const shipmentListScreens = {
  ShipmentList: { title: 'Отвесы по заявке', component: ShipmentListScreen },
};

export const freeShipmentScreens = {
  FreeShipmentEdit: { title: 'Отвес', component: FreeShipmentEditScreen },
  FreeShipmentView: { title: 'Отвес', component: FreeShipmentViewScreen },
  SelectRefItem: { title: 'Выбор из справочника', component: SelectRefItemScreen },
  ScanGood: { title: 'Сканер', component: ScanGoodScreen },
};

export const freeShipmentListScreens = {
  FreeShipmentList: { title: 'Отвесы', component: FreeShipmentListScreen },
};
