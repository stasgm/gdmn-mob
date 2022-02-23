import { SelectRefItemScreen } from '../../components/SelectRefItemScreen';
import {
  InventoryEditScreen,
  SelectGoodScreen,
  InventoryListScreen,
  InventoryViewScreen,
  InventoryLineScreen,
  SelectRemainsScreen,
} from '../../screens/Inventory';

import ScanBarcodeScreen from '../../screens/Inventory/ScanBarcodeScreen';

export const inventoryScreens = {
  InventoryEdit: InventoryEditScreen,
  InventoryView: InventoryViewScreen,
  InventoryLine: InventoryLineScreen,
  SelectRefItem: SelectRefItemScreen,
  SelectGoodItem: SelectGoodScreen,
  SelectRemainsItem: SelectRemainsScreen,
  ScanBarcode: ScanBarcodeScreen,
  // ScanBarcodeReader: ScanBarcodeReaderScreen,
};

export const inventoryListScreens = {
  InventoryList: InventoryListScreen,
};
