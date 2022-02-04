import { SelectRefItemScreen } from '../../components/SelectRefItemScreen';
import {
  DocEditScreen,
  SelectGoodScreen,
  DocListScreen,
  DocViewScreen,
  DocLineScreen,
  SelectRemainsScreen,
} from '../../screens/Docs';
import ScanBarcodeScreen from '../../screens/Docs/ScanBarcodeScreen';

export const DocScreens = {
  DocEdit: DocEditScreen,
  DocView: DocViewScreen,
  DocLine: DocLineScreen,
  SelectRefItem: SelectRefItemScreen,
  SelectGoodItem: SelectGoodScreen,
  SelectRemainsItem: SelectRemainsScreen,
  ScanBarcode: ScanBarcodeScreen,
  // ScanBarcodeReader: ScanBarcodeReaderScreen,
};

export const DocListScreens = {
  DocList: DocListScreen,
};
