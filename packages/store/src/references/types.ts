import { IReferences } from '@lib/types';

export type ReferenceState = {
  readonly list: IReferences;
  readonly loading: boolean;
  readonly loadingData: boolean;
  readonly loadErrorList: string[];
  readonly errorMessage: string;
};
