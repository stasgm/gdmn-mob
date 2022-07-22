import { SelectRefItemScreen } from '../../components/SelectRefItemScreen';

import { MoveListScreen, MoveEditScreen, MoveViewScreen, MoveLineScreen } from '../../store/screens/Movements';

import ScanBarcodeScreen from '../../store/screens/Movements/ScanBarcodeScreen';

import {
  SellbillListScreen,
  TempViewScreen,
  SellbillEditScreen,
  SellbillViewScreen,
  SellbillLineScreen,
} from '../../store/screens/Sellbills';

import ScanOrderScreen from '../../store/screens/Sellbills/ScanOrderScreen';
import ScanGoodScreen from '../../store/screens/Sellbills/ScanGoodScreen';

import {
  FreeSellbillListScreen,
  FreeSellbillEditScreen,
  FreeSellbillViewScreen,
  FreeSellbillLineScreen,
} from '../../store/screens/FreeSellbills';

export const moveScreens = {
  MoveEdit: { title: 'Перемещение', component: MoveEditScreen },
  MoveView: { title: 'Документ', component: MoveViewScreen },
  MoveLine: { title: 'Позиция перемещения', component: MoveLineScreen },
  SelectRefItem: { title: 'Выбор из справочника', component: SelectRefItemScreen },
  ScanBarcode: { title: 'Сканер', component: ScanBarcodeScreen },
  //
  // ScanBarcodeReader: ScanBarcodeReaderScreen,
};

export const moveListScreens = {
  MoveList: { title: 'Перемещение', component: MoveListScreen },
};

export const sellbillScreens = {
  TempView: { title: 'Заявка', component: TempViewScreen },
  SellbillEdit: { title: 'Заявка', component: SellbillEditScreen },
  SellbillView: { title: 'Отвес', component: SellbillViewScreen },
  SellbillLine: { title: 'Позиция отвеса', component: SellbillLineScreen },
  ScanOrder: { title: 'Сканер', component: ScanOrderScreen },
  ScanGood: { title: 'Сканер', component: ScanGoodScreen },
};

export const sellbillListScreens = {
  SellbillList: { title: 'Заявки', component: SellbillListScreen },
};

export const freeSellbillScreens = {
  FreeSellbillEdit: { title: 'Заявка', component: FreeSellbillEditScreen },
  FreeSellbillView: { title: 'Заявка', component: FreeSellbillViewScreen },
  FreeSellbillLine: { title: 'Позиция заявки', component: FreeSellbillLineScreen },
  SelectRefItem: { title: 'Выбор из справочника', component: SelectRefItemScreen },
  ScanBarcode: { title: 'Сканер', component: ScanBarcodeScreen },
  //
  // ScanBarcodeReader: ScanBarcodeReaderScreen,
};

export const freeSellbillListScreens = {
  FreeSellbillList: { title: 'Заявки', component: FreeSellbillListScreen },
};
