import { IServerLogFile } from '@lib/types';

export type IServerLogState = {
  readonly list: IServerLogFile[];
  readonly serverLog: any;
  readonly loading: boolean;
  readonly errorMessage: string;
  // readonly pageParams?: IFilePageParam;
};
