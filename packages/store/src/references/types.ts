import { IReferences } from '@lib/types';

export type ReferenceState = {
  readonly list: IReferences;
  readonly loading: boolean;
  readonly loadingData: boolean;
  readonly loadingError: string;
  readonly errorMessage: string;
};
