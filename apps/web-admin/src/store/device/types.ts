import { IDevice } from '@lib/types';

import { IPageParam } from '../../types';

export type IDeviceState = {
  readonly list: IDevice[];
  readonly loading: boolean;
  readonly errorMessage: string;
  readonly pageParams?: IPageParam;
};
