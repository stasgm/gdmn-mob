import { MoveListScreen, MoveEditScreen, MoveViewScreen, SelectCellScreen } from '../../screens/Movements';

import {
  ShipmentListScreen,
  ShipmentEditScreen,
  ShipmentViewScreen,
  ScanOrderScreen,
  ScanGoodScreen,
} from '../../screens/Shipment';

import { FreeShipmentListScreen, FreeShipmentEditScreen, FreeShipmentViewScreen } from '../../screens/FreeShipment';
import { InventoryListScreen, InventoryEditScreen, InventoryViewScreen } from '../../screens/Inventory';
import { CellsViewScreen, ContactListScreen, GoodLineScreen } from '../../screens/Cells';
import { SelectRefItemScreen } from '../../components';

export const moveScreens = {
  MoveEdit: { title: 'Перемещение', component: MoveEditScreen },
  MoveView: { title: '', component: MoveViewScreen },
  SelectRefItem: { title: 'Выбор из справочника', component: SelectRefItemScreen },
  ScanGood: { title: 'Сканер', component: ScanGoodScreen },
  SelectCell: { title: 'Выбор ячейки', component: SelectCellScreen },
};

export const moveListScreens = {
  MoveList: { title: 'Перемещение', component: MoveListScreen },
};

export const shipmentScreens = {
  ShipmentEdit: { title: 'Отвес по заявке', component: ShipmentEditScreen },
  ShipmentView: { title: '', component: ShipmentViewScreen },
  ScanOrder: { title: 'Сканер заявки', component: ScanOrderScreen },
  ScanGood: { title: 'Сканер', component: ScanGoodScreen },
  SelectCell: { title: 'Выбор ячейки', component: SelectCellScreen },
};

export const shipmentListScreens = {
  ShipmentList: { title: 'Отвесы по заявке', component: ShipmentListScreen },
};

export const freeShipmentScreens = {
  FreeShipmentEdit: { title: 'Отвес', component: FreeShipmentEditScreen },
  FreeShipmentView: { title: '', component: FreeShipmentViewScreen },
  SelectRefItem: { title: 'Выбор из справочника', component: SelectRefItemScreen },
  ScanGood: { title: 'Сканер', component: ScanGoodScreen },
};

export const freeShipmentListScreens = {
  FreeShipmentList: { title: 'Отвесы', component: FreeShipmentListScreen },
};

export const inventoryScreens = {
  InventoryEdit: { title: 'Инвентаризация', component: InventoryEditScreen },
  InventoryView: { title: '', component: InventoryViewScreen },
  SelectRefItem: { title: 'Выбор из справочника', component: SelectRefItemScreen },
  ScanGood: { title: 'Сканер', component: ScanGoodScreen },
};

export const inventoryListScreens = {
  InventoryList: { title: 'Инвентаризация', component: InventoryListScreen },
};

export const cellsScreens = {
  CellsView: { title: 'Ячейки', component: CellsViewScreen },
  GoodLine: { title: 'Позиция ячейки', component: GoodLineScreen },
};

export const cellsListScreens = {
  ContactList: { title: 'Ячейки', component: ContactListScreen },
};
