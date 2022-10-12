import { IDocument } from '@lib/types';

import { useSelector } from '../';

const selectByDocType = <T extends IDocument>(docType: string) => {
  return useSelector((state) => state.documents?.list.filter((i) => i.documentType?.name === docType)) as T[];
};

const selectByDocId = <T extends IDocument>(docId?: string) =>
  docId ? (useSelector((state) => state.documents?.list.find((i) => i.id === docId)) as T) : undefined;
export default { selectByDocType, selectByDocId };
