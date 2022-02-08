import { IDocument } from '@lib/types';

export type DocumentState = {
  readonly list: IDocument[];
  readonly loading: boolean;
  readonly loadingData: boolean;
  readonly loadingError: string;
  readonly errorMessage: string;
};
