import { IActivationCode } from '@lib/types';

export type IActivationCodeState = {
  readonly list: IActivationCode[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
