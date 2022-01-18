import { IDeviceBinding } from '@lib/types';

import { IPageParam } from '../../types';

export type IDeviceBindingState = {
  readonly list: IDeviceBinding[];
  readonly loading: boolean;
  readonly errorMessage: string;
  readonly pageParams?: IPageParam;
};
