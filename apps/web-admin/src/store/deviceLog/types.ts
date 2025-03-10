import { IDeviceLogEntry, IDeviceLogFile, Settings } from '@lib/types';

import { IDeviceLogPageParam } from '../../types';

export type IDeviceLogState = {
  readonly fileList: IDeviceLogFile[];
  readonly deviceLog: IDeviceLogEntry[];
  readonly appVersion: string;
  readonly appSettings: Settings;
  readonly loading: boolean;
  readonly errorMessage: string;
  readonly pageParams?: IDeviceLogPageParam;
};
