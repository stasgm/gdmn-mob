import { RouteViewScreen, RouteListScreen, RouteDetailScreen as RouteDetailsScreen } from '../../screens/Routes/';

import {
  DocumentEditScreen,
  DocumentLineScreen,
  DocumentListScreen,
  DocumentViewScreen,
  SelectGoodScreen,
  SelectGroupScreen,
} from '../../screens/Documents';

import SelectRefItemScreen from '../../components/SelectRefItemScreen';

const documentListScreens = {
  DocumentList: DocumentListScreen,
};

const documentScreens = {
  DocumentView: DocumentViewScreen,
  DocumentEdit: DocumentEditScreen,
  DocumentLine: DocumentLineScreen,
  SelectGroupItem: SelectGroupScreen,
  SelectGoodItem: SelectGoodScreen,
  SelectRefItem: SelectRefItemScreen,
};

/* const returnListScreens = {
  ReturnList: ReturnListScreen,
};

const returnScreens = {
  ReturnView: ReturnViewScreen,
  ReturnEdit: ReturnEditScreen,
  ReturnLine: ReturnLineScreen,
  SelectRefItem: SelectRefItemScreen,
  SelectItemReturn: SelectItemScreen,
  SellBill: SellBillScreen,
}; */

const routerScreen = {
  RouteList: RouteListScreen,
  RouteView: RouteViewScreen,
  RouteDetails: RouteDetailsScreen,
};

export { documentListScreens, documentScreens, routerScreen }; //returnListScreens, returnScreens,
