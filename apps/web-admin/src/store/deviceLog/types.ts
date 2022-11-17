import { IDeviceLogFiles } from '@lib/types';

import { IPageParam } from '../../types';

export type IDeviceLogState = {
  readonly list: IDeviceLogFiles[];
  readonly loading: boolean;
  readonly errorMessage: string;
  readonly pageParams?: IPageParam;
};
