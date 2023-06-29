import { IServerLogFile, IServerLogResponse } from '@lib/types';

export type IServerLogState = {
  readonly list: IServerLogFile[];
  readonly serverLog: IServerLogResponse;
  readonly loading: boolean;
  readonly errorMessage: string;
  // readonly pageParams?: IFilePageParam;
};
