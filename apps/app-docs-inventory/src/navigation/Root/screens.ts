import { DocumentEditScreen } from '../../screens/Documents/DocumentEditScreen';
import { DocumentListScreen } from '../../screens/Documents/DocumentListScreen';
import { DocumentViewScreen } from '../../screens/Documents/DocumentViewScreen';
import { DocumentLineScreen } from '../../screens/Documents/DocumentLineScreen';

import { SelectRefItemScreen } from '../../components/SelectRefItemScreen';

export const documentScreens = {
  DocumentEdit: DocumentEditScreen,
  DocumentView: DocumentViewScreen,
  DocumentLine: DocumentLineScreen,
  SelectRefItem: SelectRefItemScreen,
};

export const documentListScreens = {
  DocumentList: DocumentListScreen,
};
