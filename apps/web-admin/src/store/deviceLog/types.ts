import { IDeviceLog, IDeviceLogFiles, Settings } from '@lib/types';

import { IDeviceLogPageParam } from '../../types';

export type IDeviceLogState = {
  readonly filesList: IDeviceLogFiles[];
  readonly logList: IDeviceLog[];
  readonly appVersion: string;
  readonly appSettings: Settings;
  readonly loading: boolean;
  readonly errorMessage: string;
  readonly pageParams?: IDeviceLogPageParam;
};
