import { SelectRefItemScreen } from '../../components/SelectRefItemScreen';

import { MoveListScreen, MoveEditScreen, MoveViewScreen, MoveLineScreen } from '../../screens/Movements';

import ScanBarcodeScreen from '../../screens/Movements/ScanBarcodeScreen';

import {
  SellbillListScreen,
  TempViewScreen,
  SellbillEditScreen,
  SellbillViewScreen,
  SellbillLineScreen,
} from '../../screens/Sellbills';

import ScanOrderScreen from '../../screens/Sellbills/ScanOrderScreen';
import ScanGoodScreen from '../../screens/Sellbills/ScanGoodScreen';

import {
  FreeSellbillListScreen,
  FreeSellbillEditScreen,
  FreeSellbillViewScreen,
  FreeSellbillLineScreen,
} from '../../screens/FreeSellbills';

export const moveScreens = {
  MoveEdit: { title: 'Перемещение', component: MoveEditScreen },
  MoveView: { title: 'Перемещение', component: MoveViewScreen },
  MoveLine: { title: 'Позиция перемещения', component: MoveLineScreen },
  SelectRefItem: { title: 'Выбор из справочника', component: SelectRefItemScreen },
  ScanBarcode: { title: 'Сканер', component: ScanBarcodeScreen },
};

export const moveListScreens = {
  MoveList: { title: 'Перемещение', component: MoveListScreen },
};

export const sellbillScreens = {
  TempView: { title: 'Заявка', component: TempViewScreen },
  SellbillEdit: { title: 'Отвес по заявке', component: SellbillEditScreen },
  SellbillView: { title: 'Отвес по заявке', component: SellbillViewScreen },
  SellbillLine: { title: 'Позиция отвеса', component: SellbillLineScreen },
  ScanOrder: { title: 'Сканер', component: ScanOrderScreen },
  ScanGood: { title: 'Сканер', component: ScanGoodScreen },
};

export const sellbillListScreens = {
  SellbillList: { title: 'Отвесы по заявке', component: SellbillListScreen },
};

export const freeSellbillScreens = {
  FreeSellbillEdit: { title: 'Отвес', component: FreeSellbillEditScreen },
  FreeSellbillView: { title: 'Отвес', component: FreeSellbillViewScreen },
  FreeSellbillLine: { title: 'Позиция отвеса', component: FreeSellbillLineScreen },
  SelectRefItem: { title: 'Выбор из справочника', component: SelectRefItemScreen },
  ScanBarcode: { title: 'Сканер', component: ScanBarcodeScreen },
};

export const freeSellbillListScreens = {
  FreeSellbillList: { title: 'Отвесы', component: FreeSellbillListScreen },
};
