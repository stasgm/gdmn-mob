import { ISystemFile, IServerLogResponse } from '@lib/types';

import { IPageParam } from '../../types';

export type IServerLogState = {
  readonly list: ISystemFile[];
  readonly serverLog: IServerLogResponse | undefined;
  readonly loading: boolean;
  readonly errorMessage: string;
  readonly pageParams?: IPageParam;
};
