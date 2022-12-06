import { IFileSystem } from '@lib/types';

import { IPageParam } from '../../types';

export type IFileSystemState = {
  // readonly filesList: IDeviceLogFiles[];
  // readonly logList: IDeviceLog[];
  readonly list: IFileSystem[];
  readonly file: any;
  readonly loading: boolean;
  readonly errorMessage: string;
  readonly pageParams?: IPageParam;
};
