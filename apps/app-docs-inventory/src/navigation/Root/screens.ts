import {
  InventoryEditScreen,
  SelectGoodScreen,
  InventoryListScreen,
  InventoryViewScreen,
  InventoryLineScreen,
} from '../../screens/Inventorys';

import { SelectRefItemScreen } from '../../components/SelectRefItemScreen';

export const inventoryScreens = {
  InventoryEdit: InventoryEditScreen,
  InventoryView: InventoryViewScreen,
  InventoryLine: InventoryLineScreen,
  SelectRefItem: SelectRefItemScreen,
  SelectGoodItem: SelectGoodScreen,
};

export const inventoryListScreens = {
  InventoryList: InventoryListScreen,
};
