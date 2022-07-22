import { useSelector } from '@lib/store';
import { IDocument } from '@lib/types';

const docListsEq = (a: IDocument[], b: IDocument[] | undefined) => {
  if (!b) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  for (let i = a.length - 1; i > 0; i--) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
};

export function useFilteredDocList<D extends IDocument>(documentType: string): D[] {
  const filterFunc = (doc: IDocument) => doc.documentType?.name === documentType;
  return useSelector((state) => state.documents.list.filter(filterFunc) as D[], docListsEq);
}
