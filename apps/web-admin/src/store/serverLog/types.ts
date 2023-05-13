import { IServerLog } from '../../types';

export type IServerLogState = {
  readonly list: IServerLog[];
  readonly serverLog: any;
  readonly loading: boolean;
  readonly errorMessage: string;
  // readonly pageParams?: IFilePageParam;
};
