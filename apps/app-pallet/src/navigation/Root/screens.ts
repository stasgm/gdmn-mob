import { SelectRefItemScreen } from '../../components/SelectRefItemScreen';

import { PalletListScreen, PalletViewScreen, PalletGoodScreen } from '../../screens/Pallet';

export const palletListScreens = {
  PalletList: { title: 'Паллеты', component: PalletListScreen },
};

export const palletScreens = {
  PalletView: { title: 'Документ', component: PalletViewScreen },
  SelectRefItem: { title: 'Выбор из справочника', component: SelectRefItemScreen },
  PalletGood: { title: 'Сканер', component: PalletGoodScreen },
};
