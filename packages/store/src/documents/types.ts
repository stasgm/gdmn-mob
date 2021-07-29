import { IDocument } from '@lib/types';

export type DocumentState = {
  readonly list: IDocument[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
