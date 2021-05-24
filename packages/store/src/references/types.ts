import { IReferences } from '@lib/types';

export type IReferenceState = {
  readonly list: IReferences;
  readonly loading: boolean;
  readonly errorMessage: string;
};
