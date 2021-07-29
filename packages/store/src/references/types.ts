import { IReferences } from '@lib/types';

export type ReferenceState = {
  readonly list: IReferences;
  readonly loading: boolean;
  readonly errorMessage: string;
};
