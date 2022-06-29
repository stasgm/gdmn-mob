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

import { ScanListScreen, ScanViewScreen, ScanEditScreen } from '../../screens/Scan';

export const docScreens = {
  DocEdit: { title: 'Документ', component: DocEditScreen },
  DocView: { title: 'Документ', component: DocViewScreen },
  DocLine: { title: 'Позиция документа', component: DocLineScreen },
  SelectRefItem: { title: 'Выбор из справочника', component: SelectRefItemScreen },
  SelectGoodItem: { title: 'Выбор товара', component: SelectGoodScreen },
  SelectRemainsItem: { title: 'Выбор из остатков', component: SelectRemainsScreen },
  ScanBarcode: { title: 'Сканер', component: ScanBarcodeScreen },
  //
  // ScanBarcodeReader: ScanBarcodeReaderScreen,
};

export const docListScreens = {
  DocList: { title: 'Документы', component: DocListScreen },
};

export const remainsListScreens = {
  ContactList: { title: 'Остатки', component: ContactListScreen },
};

export const remainsScreens = {
  GoodList: { title: 'Остатки', component: GoodListScreen },
  GoodLine: { title: 'Позиция остатков', component: GoodLineScreen },
};

export const scanListScreens = {
  ScanList: { title: 'Сканирование', component: ScanListScreen },
};

export const scanScreens = {
  ScanView: { title: 'Документ', component: ScanViewScreen },
  ScanEdit: { title: 'Документ', component: ScanEditScreen },
  SelectRefItemScan: { title: 'Выбор из справочника', component: SelectRefItemScreen },
};
