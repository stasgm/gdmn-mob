import { SelectRefItemScreen } from '../../components/SelectRefItemScreen';

import {
  DocListScreen,
  DocEditScreen,
  DocViewScreen,
  DocLineScreen,
  SelectGoodScreen,
  SelectRemainsScreen,
} from '../../screens/Doc';

import ScanBarcodeScreen from '../../screens/Doc/ScanBarcodeScreen';

import { ContactListScreen, GoodListScreen, GoodLineScreen } from '../../screens/Remains';

export const docScreens = {
  DocEdit: DocEditScreen,
  DocView: DocViewScreen,
  DocLine: DocLineScreen,
  SelectRefItem: SelectRefItemScreen,
  SelectGoodItem: SelectGoodScreen,
  SelectRemainsItem: SelectRemainsScreen,
  ScanBarcode: ScanBarcodeScreen,
  //
  // ScanBarcodeReader: ScanBarcodeReaderScreen,
};

export const docListScreens = {
  DocList: DocListScreen,
};

export const remainsListScreens = {
  ContactList: ContactListScreen,
};

export const remainsScreens = {
  GoodList: GoodListScreen,
  GoodLine: GoodLineScreen,
};
