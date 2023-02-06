import { IDeviceLog, IDeviceLogFiles } from '@lib/types';

import { IDeviceLogPageParam } from '../../types';

export type IDeviceLogState = {
  readonly filesList: IDeviceLogFiles[];
  readonly logList: IDeviceLog[];
  readonly loading: boolean;
  readonly errorMessage: string;
  readonly pageParams?: IDeviceLogPageParam;
};
