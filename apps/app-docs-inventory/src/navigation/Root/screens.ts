import {
  DocumentEditScreen,
  SelectGoodScreen,
  DocumentListScreen,
  DocumentViewScreen,
  DocumentLineScreen,
} from '../../screens/Documents';

import { SelectRefItemScreen } from '../../components/SelectRefItemScreen';

export const documentScreens = {
  DocumentEdit: DocumentEditScreen,
  DocumentView: DocumentViewScreen,
  DocumentLine: DocumentLineScreen,
  SelectRefItem: SelectRefItemScreen,
  SelectGoodItem: SelectGoodScreen,
};

export const documentListScreens = {
  DocumentList: DocumentListScreen,
};
