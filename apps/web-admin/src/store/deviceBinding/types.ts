import { IDeviceBinding } from '@lib/types';

export type IDeviceBindingState = {
  readonly list: IDeviceBinding[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
