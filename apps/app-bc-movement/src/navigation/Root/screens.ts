import { SelectRefItemScreen } from '../../components/SelectRefItemScreen';
import { MovementEditScreen, MovementListScreen, MovementViewScreen } from '../../screens/Inventory';
import ScanBarcodeScreen from '../../screens/Inventory/ScanBarcodeScreen';

export const movementScreens = {
  MovementEdit: MovementEditScreen,
  MovementView: MovementViewScreen,
  SelectRefItem: SelectRefItemScreen,
  ScanBarcode: ScanBarcodeScreen,
  // ScanBarcodeReader: ScanBarcodeReaderScreen,
};

export const movementListScreens = {
  MovementList: MovementListScreen,
};
