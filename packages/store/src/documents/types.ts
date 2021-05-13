import { IDocument } from '@lib/types';

export type IDocumentState = {
  readonly list: IDocument[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
