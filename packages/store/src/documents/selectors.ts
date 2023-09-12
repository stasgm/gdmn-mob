import { IDocument } from '@lib/types';

import { useProxySelector } from '../';

const selectByDocId = <T extends IDocument>(docId?: string) =>
  useProxySelector<T | undefined>((state) => state.documents?.list.find((doc: T) => doc.id === docId), [docId]);

const selectByDocType = <T extends IDocument>(docType: string) =>
  useProxySelector<T[]>(
    (state) => state.documents?.list.filter((doc: T) => doc.documentType?.name === docType) || [],
    [docType],
  );

const selectByDocSubType = <T extends IDocument>(docSubType: string) =>
  useProxySelector<T[]>(
    (state) => state.documents?.list.filter((doc: T) => doc.documentType?.subtype === docSubType) || [],
    [docSubType],
  );

export default { selectByDocType, selectByDocId, selectByDocSubType };
