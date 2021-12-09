import {
  InventoryEditScreen,
  SelectGoodScreen,
  InventoryListScreen,
  InventoryViewScreen,
  InventoryLineScreen,
  SelectRemainsScreen,
} from '../../screens/Inventory';

import { SelectRefItemScreen } from '../../components/SelectRefItemScreen';
import { ScanBarcodeScreen } from '../../screens/Inventory/components/Scanners/ScanBarcode';

export const inventoryScreens = {
  InventoryEdit: InventoryEditScreen,
  InventoryView: InventoryViewScreen,
  InventoryLine: InventoryLineScreen,
  SelectRefItem: SelectRefItemScreen,
  SelectGoodItem: SelectGoodScreen,
  SelectRemainsItem: SelectRemainsScreen,
  ScanBarcode: ScanBarcodeScreen,
};

export const inventoryListScreens = {
  InventoryList: InventoryListScreen,
};
