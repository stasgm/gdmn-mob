import { SelectRefItemScreen } from '../../components/SelectRefItemScreen';
import { MovementEditScreen, MovementListScreen, MovementViewScreen } from '../../screens/movement';
import ScanBarcodeScreen from '../../screens/movement/ScanBarcodeScreen';

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
