import { IDocument } from '@lib/types';

import { useSelector } from '../';

const selectByDocType = <T extends IDocument>(docType: string) => {
  return useSelector((state: any) => state.documents?.list.filter((i: any) => i.documentType?.name === docType)) as T[];
};

const selectByDocId = <T extends IDocument>(docId?: string) => {
  return useSelector((state: any) => state.documents?.list.find((i: any) => i.id === docId)) as T | undefined;
};

export default { selectByDocType, selectByDocId };
