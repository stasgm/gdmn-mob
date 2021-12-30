import {
  InventoryEditScreen2,
  // InventoryEditScreen,
  SelectGoodScreen,
  InventoryListScreen,
  InventoryViewScreen,
  InventoryLineScreen1,
  // InventoryLineScreen,
  SelectRemainsScreen,
} from '../../screens/Inventory';

import { SelectRefItemScreen } from '../../components/SelectRefItemScreen';
import { ScanBarcodeScreen } from '../../components/Scanners/ScanBarcode';
import { ScanBarcodeReaderScreen } from '../../components/Scanners/ScanBarcodeReader';

export const inventoryScreens = {
  // InventoryEdit: InventoryEditScreen,
  InventoryEdit: InventoryEditScreen2,
  InventoryView: InventoryViewScreen,
  InventoryLine: InventoryLineScreen1,
  // InventoryLine: InventoryLineScreen,
  SelectRefItem: SelectRefItemScreen,
  SelectGoodItem: SelectGoodScreen,
  SelectRemainsItem: SelectRemainsScreen,
  ScanBarcode: ScanBarcodeScreen,
  ScanBarcodeReader: ScanBarcodeReaderScreen,
};

export const inventoryListScreens = {
  InventoryList: InventoryListScreen,
};
