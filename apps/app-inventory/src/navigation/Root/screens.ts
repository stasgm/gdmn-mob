import {
  InventoryEditScreen,
  SelectGoodScreen,
  InventoryListScreen,
  InventoryViewScreen,
  InventoryLineScreen,
  // SelectRemainsScreen,
} from '../../screens/Inventory';

import { SelectRefItemScreen } from '../../components/SelectRefItemScreen';
import { ScanBarcodeScreen } from '../../screens/Inventory/components/Scanners/ScanBarcode';
import { ScanBarcodeReaderScreen } from '../../screens/Inventory/components/Scanners/ScanBarcodeReader';

export const inventoryScreens = {
  InventoryEdit: InventoryEditScreen,
  InventoryView: InventoryViewScreen,
  InventoryLine: InventoryLineScreen,
  SelectRefItem: SelectRefItemScreen,
  SelectGoodItem: SelectGoodScreen,
  //SelectRemainsItem: SelectRemainsScreen,
  ScanBarcode: ScanBarcodeScreen,
  ScanBarcodeReader: ScanBarcodeReaderScreen,
};

export const inventoryListScreens = {
  InventoryList: InventoryListScreen,
};
