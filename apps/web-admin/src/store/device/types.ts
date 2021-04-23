import { IDevice } from '@lib/types';

export type IDeviceState = {
  readonly list: IDevice[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
