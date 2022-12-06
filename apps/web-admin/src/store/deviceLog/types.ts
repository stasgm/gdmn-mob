import { IDeviceLog, IDeviceLogFiles } from '@lib/types';

import { IPageParam } from '../../types';

export type IDeviceLogState = {
  readonly filesList: IDeviceLogFiles[];
  readonly logList: IDeviceLog[];
  readonly loading: boolean;
  readonly errorMessage: string;
  readonly pageParams?: IPageParam;
};
