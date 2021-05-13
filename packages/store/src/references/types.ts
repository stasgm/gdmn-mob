import { IReference } from '@lib/types';

export type IReferenceState = {
  readonly list: IReference[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
