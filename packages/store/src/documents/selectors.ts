import { IDocument } from '@lib/types';

import { useSelector } from '../';

const selectByDocType = <T extends IDocument>(docType: string) => {
  return useSelector((state) => state.documents.list.filter((i) => i.documentType?.name === docType)) as T[];
};

export default { selectByDocType };
